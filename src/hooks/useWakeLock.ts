import { useEffect, useState } from 'react';

type Sentinel = { release: () => Promise<void> };
type WakeLockNavigator = Navigator & {
  wakeLock?: { request: (type: 'screen') => Promise<Sentinel> };
};

const wakeLock = () => (navigator as WakeLockNavigator).wakeLock;

/**
 * 실행 중 화면 꺼짐을 막는다. 미지원 여부를 돌려줘 화면에서 안내할 수 있게 한다.
 * 브라우저는 탭이 숨겨지면 잠금을 스스로 해제하므로 복귀할 때 다시 요청한다.
 */
export function useWakeLock(active: boolean): boolean {
  const supported = !!wakeLock();
  const [resumeKey, setResumeKey] = useState(0);

  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) setResumeKey((k) => k + 1);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  useEffect(() => {
    const api = wakeLock();
    if (!active || !api || document.hidden) return;

    let sentinel: Sentinel | null = null;
    let cancelled = false;

    api
      .request('screen')
      .then((s) => {
        if (cancelled) void s.release();
        else sentinel = s;
      })
      .catch(() => {
        // 저전력 모드 등에서 거부될 수 있다. 타이머 동작과는 무관하므로 무시
      });

    return () => {
      cancelled = true;
      void sentinel?.release().catch(() => {});
    };
  }, [active, resumeKey]);

  return supported;
}
