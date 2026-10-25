import { describe, expect, it } from 'vitest';
import type { Phase } from './buildPhases';
import { INITIAL_STATE, type TimerState, timerReducer } from './timerReducer';

const work = (durationSec: number, cycle = 1): Phase => ({
  type: 'work',
  durationSec,
  set: 1,
  cycle,
});
const rest = (durationSec: number, cycle = 1): Phase => ({
  type: 'rest',
  durationSec,
  set: 1,
  cycle,
});

function start(phases: Phase[], beepAt: number[] = [], now = 0): TimerState {
  return timerReducer(INITIAL_STATE, { type: 'START', phases, beepAt, now });
}
function tick(state: TimerState, now: number): TimerState {
  return timerReducer(state, { type: 'TICK', now });
}

describe('START', () => {
  it('첫 단계를 running으로 시작한다', () => {
    const s = start([work(20), rest(10)], [3], 1000);
    expect(s.status).toBe('running');
    expect(s.index).toBe(0);
    expect(s.phaseEndsAt).toBe(21000);
    expect(s.remainingMs).toBe(20000);
    expect(s.pendingBeeps).toEqual([]);
  });

  it('단계가 없으면 시작하지 않는다', () => {
    expect(start([]).status).toBe('idle');
  });
});

describe('PAUSE / RESUME', () => {
  it('일시정지 후 재개하면 남은 시간이 유지된다', () => {
    let s = start([work(20)], [], 0);
    s = tick(s, 5000);
    s = timerReducer(s, { type: 'PAUSE', now: 5000 });
    expect(s.status).toBe('paused');
    expect(s.remainingMs).toBe(15000);

    // 30초 동안 멈춰 있어도 남은 시간은 그대로
    s = timerReducer(s, { type: 'RESUME', now: 35000 });
    expect(s.status).toBe('running');
    expect(s.remainingMs).toBe(15000);
    expect(s.phaseEndsAt).toBe(50000);
    expect(tick(s, 35000).remainingMs).toBe(15000);
  });

  it('일시정지 중 TICK은 상태를 바꾸지 않는다', () => {
    let s = start([work(20)], [], 0);
    s = timerReducer(s, { type: 'PAUSE', now: 5000 });
    expect(tick(s, 99999)).toBe(s);
  });
});

describe('단계 전환', () => {
  it('틱이 2초 늦으면 넘친 시간이 다음 단계에서 차감된다', () => {
    let s = start([work(10), rest(5)], [], 0);
    s = tick(s, 12000);
    expect(s.index).toBe(1);
    expect(s.phaseEndsAt).toBe(15000);
    expect(s.remainingMs).toBe(3000);
    expect(s.pendingBeeps).toEqual(['long']);
  });

  it('한 틱에 단계가 2개 이상 지나가면 short·long을 내지 않는다', () => {
    let s = start([work(10), rest(5), work(10, 2)], [3], 0);
    s = tick(s, 16000);
    expect(s.index).toBe(2);
    expect(s.phaseEndsAt).toBe(25000);
    expect(s.pendingBeeps).toEqual([]);
  });

  it('백그라운드에서 전체가 지나가면 finished, finish만 1회', () => {
    let s = start([work(10), rest(5), work(10, 2)], [3], 0);
    s = tick(s, 600000);
    expect(s.status).toBe('finished');
    expect(s.pendingBeeps).toEqual(['finish']);
  });

  it('마지막 단계 종료는 finish 1회, long 아님', () => {
    let s = start([work(3)], [], 0);
    s = tick(s, 3000);
    expect(s.status).toBe('finished');
    expect(s.remainingMs).toBe(0);
    expect(s.pendingBeeps).toEqual(['finish']);
  });
});

describe('SKIP', () => {
  it('다음 단계로 넘어가고 beep은 내지 않는다', () => {
    let s = start([work(10), rest(5)], [], 0);
    s = timerReducer(s, { type: 'SKIP', now: 2000 });
    expect(s.index).toBe(1);
    expect(s.status).toBe('running');
    expect(s.phaseEndsAt).toBe(7000);
    expect(s.pendingBeeps).toEqual([]);
  });

  it('paused에서 건너뛰면 다음 단계에서 paused를 유지한다', () => {
    let s = start([work(10), rest(5)], [], 0);
    s = timerReducer(s, { type: 'PAUSE', now: 2000 });
    s = timerReducer(s, { type: 'SKIP', now: 2000 });
    expect(s.index).toBe(1);
    expect(s.status).toBe('paused');
    expect(s.remainingMs).toBe(5000);
    expect(tick(s, 999999)).toBe(s);
  });

  it('마지막 단계에서 건너뛰면 완료된다', () => {
    let s = start([work(10)], [], 0);
    s = timerReducer(s, { type: 'SKIP', now: 2000 });
    expect(s.status).toBe('finished');
    expect(s.pendingBeeps).toEqual(['finish']);
  });
});

describe('PREV', () => {
  it('직전 단계 처음으로 돌아간다', () => {
    let s = start([work(10), rest(5)], [3], 0);
    s = tick(s, 12000); // rest 진행 중, 3초 beep 울림
    s = timerReducer(s, { type: 'PREV', now: 12000 });
    expect(s.index).toBe(0);
    expect(s.status).toBe('running');
    expect(s.phaseEndsAt).toBe(22000);
    expect(s.remainingMs).toBe(10000);
    expect(s.firedBeeps).toEqual([]);
  });

  it('paused에서 돌아가면 paused를 유지한다', () => {
    let s = start([work(10), rest(5)], [], 0);
    s = timerReducer(s, { type: 'SKIP', now: 1000 });
    s = timerReducer(s, { type: 'PAUSE', now: 2000 });
    s = timerReducer(s, { type: 'PREV', now: 2000 });
    expect(s.index).toBe(0);
    expect(s.status).toBe('paused');
    expect(s.remainingMs).toBe(10000);
  });

  it('첫 단계·idle·finished에서는 무시한다', () => {
    const first = start([work(10), rest(5)], [], 0);
    expect(timerReducer(first, { type: 'PREV', now: 1000 })).toBe(first);
    expect(timerReducer(INITIAL_STATE, { type: 'PREV', now: 0 })).toBe(INITIAL_STATE);
    const done = tick(first, 99999);
    expect(timerReducer(done, { type: 'PREV', now: 99999 })).toBe(done);
  });
});

describe('RESET', () => {
  it('어느 상태에서든 idle로 돌아간다', () => {
    let s = start([work(10)], [3], 0);
    s = tick(s, 5000);
    expect(timerReducer(s, { type: 'RESET' })).toEqual(INITIAL_STATE);

    s = tick(s, 99999);
    expect(s.status).toBe('finished');
    expect(timerReducer(s, { type: 'RESET' })).toEqual(INITIAL_STATE);
  });
});

describe('beep 규칙', () => {
  it('beepAt = [5, 3]이면 단계마다 5초·3초 전 1회씩, 종료 시 long', () => {
    let s = start([work(10), rest(10)], [5, 3], 0);

    s = tick(s, 4000); // 남은 6초
    expect(s.pendingBeeps).toEqual([]);

    s = tick(s, 5000); // 남은 5초
    expect(s.pendingBeeps).toEqual(['short']);

    s = tick(s, 5500); // 같은 5초 구간 — 다시 울리지 않음
    expect(s.pendingBeeps).toEqual(['short']);

    s = timerReducer(s, { type: 'CONSUME_BEEPS' });
    s = tick(s, 7000); // 남은 3초
    expect(s.pendingBeeps).toEqual(['short']);

    s = timerReducer(s, { type: 'CONSUME_BEEPS' });
    s = tick(s, 10000); // 단계 종료
    expect(s.index).toBe(1);
    expect(s.pendingBeeps).toEqual(['long']);

    // 다음 단계에서 firedBeeps가 비워져 다시 울린다
    s = timerReducer(s, { type: 'CONSUME_BEEPS' });
    s = tick(s, 15000); // 남은 5초
    expect(s.pendingBeeps).toEqual(['short']);
  });

  it('단계 3초인데 beepAt = [5]면 울리지 않는다', () => {
    let s = start([work(3)], [5], 0);
    s = tick(s, 100);
    s = tick(s, 1000);
    s = tick(s, 2500);
    expect(s.pendingBeeps).toEqual([]);
  });

  it('한 틱에 두 시점이 함께 걸리면 둘 다 울린다', () => {
    let s = start([work(10)], [5, 4], 0);
    s = tick(s, 6500); // 남은 3.5초 → 올림 4초, 5와 4가 함께 걸림
    expect(s.pendingBeeps).toEqual(['short', 'short']);
  });

  it('beepAt이 비면 짧은 beep 없이 종료 beep만', () => {
    let s = start([work(2), rest(2)], [], 0);
    s = tick(s, 1000);
    expect(s.pendingBeeps).toEqual([]);
    s = tick(s, 2000);
    expect(s.pendingBeeps).toEqual(['long']);
  });

  it('CONSUME_BEEPS는 대기 목록만 비운다', () => {
    let s = start([work(10)], [5], 0);
    s = tick(s, 5000);
    expect(s.pendingBeeps).toEqual(['short']);
    const cleared = timerReducer(s, { type: 'CONSUME_BEEPS' });
    expect(cleared.pendingBeeps).toEqual([]);
    expect(cleared.firedBeeps).toEqual([5]);
    expect(cleared.index).toBe(s.index);
  });

  it('소리가 쌓여 있으면 유실되지 않고 누적된다', () => {
    let s = start([work(10)], [5, 3], 0);
    s = tick(s, 5000);
    s = tick(s, 7000);
    expect(s.pendingBeeps).toEqual(['short', 'short']);
  });
});
