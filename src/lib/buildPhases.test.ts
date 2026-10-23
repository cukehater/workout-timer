import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, type TimerConfig } from './config';
import { buildPhases, totalSeconds } from './buildPhases';

const config = (over: Partial<TimerConfig> = {}): TimerConfig => ({ ...DEFAULT_CONFIG, ...over });
const types = (c: TimerConfig) => buildPhases(c).map((p) => p.type);
const count = (c: TimerConfig, type: string) => types(c).filter((t) => t === type).length;

describe('buildPhases', () => {
  it('1세트 × 1사이클이면 [prep, work]만, 휴식 없음', () => {
    expect(types(config({ sets: 1, cycles: 1 }))).toEqual(['prep', 'work']);
  });

  it('3세트 × 4사이클이면 work 12개, rest 9개, setRest 2개', () => {
    const c = config({ sets: 3, cycles: 4 });
    expect(count(c, 'work')).toBe(12);
    expect(count(c, 'rest')).toBe(9);
    expect(count(c, 'setRest')).toBe(2);
  });

  it('마지막 원소는 항상 마지막 세트의 work (F8)', () => {
    for (const c of [
      config({ sets: 1, cycles: 1 }),
      config({ sets: 3, cycles: 4 }),
      config({ sets: 5, cycles: 2, setRestSec: 120 }),
    ]) {
      const phases = buildPhases(c);
      const last = phases[phases.length - 1];
      expect(last.type).toBe('work');
      expect(last.set).toBe(c.sets);
      expect(last.cycle).toBe(c.cycles);
    }
  });

  it('prepSec = 0이면 prep 단계 생략', () => {
    expect(count(config({ prepSec: 0 }), 'prep')).toBe(0);
  });

  it('restSec = 0이면 rest 단계 생략', () => {
    expect(count(config({ restSec: 0 }), 'rest')).toBe(0);
  });

  it('setRestSec = 0이면 setRest 단계 생략', () => {
    expect(count(config({ setRestSec: 0 }), 'setRest')).toBe(0);
  });

  it('세트의 마지막 사이클 뒤에는 rest가 아니라 setRest가 온다', () => {
    const c = config({ sets: 2, cycles: 2 });
    expect(types(c)).toEqual([
      'prep',
      'work',
      'rest',
      'work',
      'setRest',
      'work',
      'rest',
      'work',
    ]);
  });

  it('set과 cycle 번호는 1부터, prep/setRest는 cycle 0', () => {
    const phases = buildPhases(config({ sets: 2, cycles: 2 }));
    expect(phases[0]).toEqual({ type: 'prep', durationSec: 10, set: 1, cycle: 0 });
    expect(phases[1]).toMatchObject({ type: 'work', set: 1, cycle: 1 });
    expect(phases[4]).toEqual({ type: 'setRest', durationSec: 60, set: 1, cycle: 0 });
    expect(phases[5]).toMatchObject({ type: 'work', set: 2, cycle: 1 });
  });

  it('설계서 예시: 준비 10 / 운동 20 / 휴식 10 / 2세트 × 3사이클 / 세트휴식 60 → 12단계, 230초', () => {
    const c = config({ prepSec: 10, workSec: 20, restSec: 10, sets: 2, cycles: 3, setRestSec: 60 });
    const phases = buildPhases(c);
    expect(phases).toHaveLength(12);
    expect(totalSeconds(phases)).toBe(230);
  });
});

describe('totalSeconds', () => {
  it('빈 배열은 0', () => {
    expect(totalSeconds([])).toBe(0);
  });
});
