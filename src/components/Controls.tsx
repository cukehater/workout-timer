import type { RunStatus } from '../lib/timerReducer';

type Props = {
  status: RunStatus;
  canPrev: boolean;
  onPause: () => void;
  onResume: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onResetRequest: () => void;
};

export function Controls({
  status,
  canPrev,
  onPause,
  onResume,
  onPrev,
  onSkip,
  onResetRequest,
}: Props) {
  const paused = status === 'paused';

  return (
    <div className="controls">
      <button type="button" className="btn" onClick={onPrev} disabled={!canPrev}>
        이전
      </button>
      <button type="button" className="btn btn--phase" onClick={paused ? onResume : onPause}>
        {paused ? '재개' : '일시정지'}
      </button>
      <button type="button" className="btn" onClick={onSkip}>
        건너뛰기
      </button>
      <button type="button" className="btn" onClick={onResetRequest}>
        리셋
      </button>
    </div>
  );
}
