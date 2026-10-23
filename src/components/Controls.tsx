import type { RunStatus } from '../lib/timerReducer';

type Props = {
  status: RunStatus;
  muted: boolean;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onResetRequest: () => void;
  onToggleMute: () => void;
};

export function Controls({
  status,
  muted,
  onPause,
  onResume,
  onSkip,
  onResetRequest,
  onToggleMute,
}: Props) {
  const paused = status === 'paused';

  return (
    <div className="controls">
      <button
        type="button"
        className="btn btn--primary"
        onClick={paused ? onResume : onPause}
      >
        {paused ? '재개' : '일시정지'}
      </button>
      <button type="button" className="btn" onClick={onSkip}>
        건너뛰기
      </button>
      <button type="button" className="btn" onClick={onResetRequest}>
        리셋
      </button>
      <button
        type="button"
        className="btn"
        aria-pressed={muted}
        onClick={onToggleMute}
      >
        {muted ? '소리 켜기' : '음소거'}
      </button>
    </div>
  );
}
