import { useEffect, useState } from 'react';
import { clampConfig, type TimerConfig } from '../lib/config';

const KEY = 'workout-timer:settings';

type Stored = { config: TimerConfig; muted: boolean };

function read(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    const source = (typeof parsed === 'object' && parsed !== null ? parsed : {}) as {
      config?: unknown;
      muted?: unknown;
    };
    // 손으로 고친 값도 clampConfig을 통과시켜 범위 안으로 들여온다
    return { config: clampConfig(source.config), muted: source.muted === true };
  } catch {
    return { config: clampConfig(null), muted: false };
  }
}

/** 설정과 음소거 상태를 한 키에 함께 저장한다 */
export function useStoredSettings() {
  const [stored, setStored] = useState<Stored>(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(stored));
    } catch {
      // 시크릿 모드 등에서 저장이 막혀도 타이머는 그대로 동작한다
    }
  }, [stored]);

  return {
    config: stored.config,
    muted: stored.muted,
    setConfig: (config: TimerConfig) => setStored((s) => ({ ...s, config })),
    toggleMuted: () => setStored((s) => ({ ...s, muted: !s.muted })),
  };
}
