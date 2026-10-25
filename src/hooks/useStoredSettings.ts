import { useEffect, useState } from 'react';
import { clampConfig, type TimerConfig } from '../lib/config';

const KEY = 'workout-timer:settings';

function read(): TimerConfig {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    const source = (typeof parsed === 'object' && parsed !== null ? parsed : {}) as {
      config?: unknown;
    };
    // 손으로 고친 값도 clampConfig을 통과시켜 범위 안으로 들여온다
    return clampConfig(source.config);
  } catch {
    return clampConfig(null);
  }
}

/** 마지막 설정을 저장한다. 예전 저장값의 muted 필드는 읽지 않고 다음 저장 때 사라진다 */
export function useStoredSettings() {
  const [config, setConfig] = useState<TimerConfig>(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ config }));
    } catch {
      // 시크릿 모드 등에서 저장이 막혀도 타이머는 그대로 동작한다
    }
  }, [config]);

  return { config, setConfig };
}
