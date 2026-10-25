import { useCallback, useEffect, useReducer } from 'react';
import { buildPhases } from '../lib/buildPhases';
import type { TimerConfig } from '../lib/config';
import { INITIAL_STATE, timerReducer } from '../lib/timerReducer';
import { useBeep } from './useBeep';

/** 백그라운드에서 rAF가 멈춰도 돌아가는 보조 틱 */
const FALLBACK_TICK_MS = 250;

export function useTimer(config: TimerConfig) {
  const [state, dispatch] = useReducer(timerReducer, INITIAL_STATE);
  const { unlock, play } = useBeep();

  const tick = useCallback(() => dispatch({ type: 'TICK', now: performance.now() }), []);

  // 틱 루프: rAF는 화면 표시용, setInterval은 백그라운드 대비
  useEffect(() => {
    if (state.status !== 'running') return;
    let raf = 0;
    const frame = () => {
      tick();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const interval = setInterval(tick, FALLBACK_TICK_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
  }, [state.status, tick]);

  // 복귀 즉시 재계산해 지나간 단계를 건너뛴다
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [tick]);

  // 리듀서가 결정한 소리를 재생하고 대기 목록을 비운다
  useEffect(() => {
    if (state.pendingBeeps.length === 0) return;
    for (const kind of state.pendingBeeps) play(kind);
    dispatch({ type: 'CONSUME_BEEPS' });
  }, [state.pendingBeeps, play]);

  const start = useCallback(() => {
    unlock(); // 사용자 제스처 안에서 AudioContext를 열어둬야 한다
    dispatch({
      type: 'START',
      phases: buildPhases(config),
      beepAt: config.beepAt,
      now: performance.now(),
    });
  }, [config, unlock]);

  const pause = useCallback(() => dispatch({ type: 'PAUSE', now: performance.now() }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME', now: performance.now() }), []);
  const skip = useCallback(() => dispatch({ type: 'SKIP', now: performance.now() }), []);
  const prev = useCallback(() => dispatch({ type: 'PREV', now: performance.now() }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return { state, start, pause, resume, skip, prev, reset };
}
