import type { TimerConfig } from './config';

export type PhaseType = 'prep' | 'work' | 'rest' | 'setRest';

export type Phase = {
  type: PhaseType;
  durationSec: number;
  /** 1부터 */
  set: number;
  /** 1부터. prep/setRest는 0 */
  cycle: number;
};

export const PHASE_LABELS: Record<PhaseType, string> = {
  prep: '준비',
  work: '운동',
  rest: '휴식',
  setRest: '세트 휴식',
};

/**
 * 설정으로부터 단계 시퀀스를 한 번에 만든다.
 * 흐름 분기(F8, 0초 단계 생략, 세트 마지막 사이클 뒤 setRest)가 모두 여기 모인다.
 */
export function buildPhases(c: TimerConfig): Phase[] {
  const out: Phase[] = [];
  if (c.prepSec > 0) out.push({ type: 'prep', durationSec: c.prepSec, set: 1, cycle: 0 });
  for (let s = 1; s <= c.sets; s++) {
    for (let k = 1; k <= c.cycles; k++) {
      out.push({ type: 'work', durationSec: c.workSec, set: s, cycle: k });
      const lastCycle = k === c.cycles;
      if (!lastCycle && c.restSec > 0) {
        out.push({ type: 'rest', durationSec: c.restSec, set: s, cycle: k });
      }
    }
    const lastSet = s === c.sets;
    if (!lastSet && c.setRestSec > 0) {
      out.push({ type: 'setRest', durationSec: c.setRestSec, set: s, cycle: 0 });
    }
  }
  return out; // 마지막 원소는 항상 마지막 세트의 work (F8)
}

export function totalSeconds(phases: Phase[]): number {
  return phases.reduce((sum, p) => sum + p.durationSec, 0);
}
