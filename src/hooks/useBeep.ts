import { useCallback, useRef } from 'react';
import type { BeepKind } from '../lib/timerReducer';

const TONES: Record<Exclude<BeepKind, 'finish'>, { freq: number; ms: number }> = {
  short: { freq: 880, ms: 120 },
  long: { freq: 1320, ms: 400 },
};

/** 완료 beep은 긴 beep 3회 */
const FINISH_REPEAT = 3;
const FINISH_GAP_MS = 150;

const PEAK_GAIN = 0.25;
const FADE_SEC = 0.012;

function tone(ctx: AudioContext, freq: number, ms: number, startAt: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const end = startAt + ms / 1000;

  osc.type = 'sine';
  osc.frequency.value = freq;

  // 양끝을 짧게 페이드해 딸깍 잡음을 없앤다
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(PEAK_GAIN, startAt + FADE_SEC);
  gain.gain.setValueAtTime(PEAK_GAIN, end - FADE_SEC);
  gain.gain.linearRampToValueAtTime(0, end);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(end + 0.02);
}

export function useBeep(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  /** iOS Safari는 사용자 제스처 안에서만 AudioContext를 열 수 있다 */
  const unlock = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
  }, []);

  const play = useCallback(
    (kind: BeepKind) => {
      const ctx = ctxRef.current;
      if (muted || !ctx) return;
      const now = ctx.currentTime;
      if (kind === 'finish') {
        const { freq, ms } = TONES.long;
        for (let i = 0; i < FINISH_REPEAT; i++) {
          tone(ctx, freq, ms, now + (i * (ms + FINISH_GAP_MS)) / 1000);
        }
        return;
      }
      const { freq, ms } = TONES[kind];
      tone(ctx, freq, ms, now);
    },
    [muted],
  );

  return { unlock, play };
}
