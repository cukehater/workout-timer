import type { Phase } from './buildPhases';

export type RunStatus = 'idle' | 'running' | 'paused' | 'finished';

/** 재생할 소리. 결정은 리듀서가 하고 재생은 useTimer가 한다 */
export type BeepKind = 'short' | 'long' | 'finish';

export type TimerState = {
  status: RunStatus;
  phases: Phase[];
  beepAt: number[];
  index: number;
  /** performance.now() 기준 현재 단계 종료 시각(ms) */
  phaseEndsAt: number;
  /** 표시용 남은 시간. paused일 때는 재개 기준값 */
  remainingMs: number;
  /** 현재 단계에서 이미 울린 beepAt 값 */
  firedBeeps: number[];
  /** 재생 대기. useTimer가 재생한 뒤 CONSUME_BEEPS로 비운다 */
  pendingBeeps: BeepKind[];
};

export type TimerAction =
  | { type: 'START'; phases: Phase[]; beepAt: number[]; now: number }
  | { type: 'TICK'; now: number }
  | { type: 'PAUSE'; now: number }
  | { type: 'RESUME'; now: number }
  | { type: 'SKIP'; now: number }
  | { type: 'RESET' }
  | { type: 'CONSUME_BEEPS' };

export const INITIAL_STATE: TimerState = {
  status: 'idle',
  phases: [],
  beepAt: [],
  index: 0,
  phaseEndsAt: 0,
  remainingMs: 0,
  firedBeeps: [],
  pendingBeeps: [],
};

/** 이번 틱에 처음으로 조건이 걸린 beepAt 값들 */
function dueBeeps(state: TimerState, remainingMs: number): number[] {
  const duration = state.phases[state.index].durationSec;
  const remainingSec = Math.ceil(remainingMs / 1000);
  return state.beepAt.filter(
    (n) => n <= duration && remainingSec <= n && !state.firedBeeps.includes(n),
  );
}

function finish(state: TimerState): TimerState {
  return {
    ...state,
    status: 'finished',
    index: Math.max(0, state.phases.length - 1),
    remainingMs: 0,
    firedBeeps: [],
    pendingBeeps: [...state.pendingBeeps, 'finish'],
  };
}

function tick(state: TimerState, now: number): TimerState {
  const { phases } = state;
  let index = state.index;
  let endsAt = state.phaseEndsAt;
  let advanced = 0;

  while (now >= endsAt) {
    if (index + 1 >= phases.length) return finish(state);
    index += 1;
    endsAt += phases[index].durationSec * 1000;
    advanced += 1;
  }

  if (advanced > 0) {
    // 단계가 2개 이상 지나갔으면 따라잡기(백그라운드 복귀)이므로 지나간 소리를 내지 않는다
    const beeps: BeepKind[] = advanced === 1 ? ['long'] : [];
    return {
      ...state,
      index,
      phaseEndsAt: endsAt,
      remainingMs: endsAt - now,
      firedBeeps: [],
      pendingBeeps: [...state.pendingBeeps, ...beeps],
    };
  }

  const remainingMs = endsAt - now;
  const due = dueBeeps(state, remainingMs);
  if (due.length === 0) return { ...state, remainingMs };
  return {
    ...state,
    remainingMs,
    firedBeeps: [...state.firedBeeps, ...due],
    pendingBeeps: [...state.pendingBeeps, ...due.map((): BeepKind => 'short')],
  };
}

function skip(state: TimerState, now: number): TimerState {
  const next = state.index + 1;
  if (next >= state.phases.length) return finish(state);
  const durationMs = state.phases[next].durationSec * 1000;
  return {
    ...state,
    index: next,
    phaseEndsAt: now + durationMs,
    remainingMs: durationMs,
    firedBeeps: [],
  };
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START': {
      if (action.phases.length === 0) return state;
      const durationMs = action.phases[0].durationSec * 1000;
      return {
        status: 'running',
        phases: action.phases,
        beepAt: action.beepAt,
        index: 0,
        phaseEndsAt: action.now + durationMs,
        remainingMs: durationMs,
        firedBeeps: [],
        pendingBeeps: [],
      };
    }

    case 'TICK':
      return state.status === 'running' ? tick(state, action.now) : state;

    case 'PAUSE':
      if (state.status !== 'running') return state;
      return {
        ...state,
        status: 'paused',
        remainingMs: Math.max(0, state.phaseEndsAt - action.now),
      };

    case 'RESUME':
      if (state.status !== 'paused') return state;
      return { ...state, status: 'running', phaseEndsAt: action.now + state.remainingMs };

    case 'SKIP':
      if (state.status !== 'running' && state.status !== 'paused') return state;
      return skip(state, action.now);

    case 'RESET':
      return INITIAL_STATE;

    case 'CONSUME_BEEPS':
      return state.pendingBeeps.length === 0 ? state : { ...state, pendingBeeps: [] };
  }
}
