import { PHASE_LABELS, type Phase } from '../lib/buildPhases';
import { formatMMSS } from '../lib/format';

const RADIUS = 86;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  phase: Phase;
  remainingMs: number;
};

export function TimerDisplay({ phase, remainingMs }: Props) {
  const totalMs = phase.durationSec * 1000;
  const elapsed = totalMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / totalMs)) : 1;

  return (
    <div className="display">
      <svg className="display__ring" viewBox="0 0 200 200" aria-hidden="true">
        <circle className="display__track" cx="100" cy="100" r={RADIUS} />
        <circle
          className="display__progress"
          cx="100"
          cy="100"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * elapsed}
        />
      </svg>
      <div className="display__center">
        {/* 색만으로 구분하지 않도록 단계명을 항상 함께 보여준다 */}
        <span className="display__phase">{PHASE_LABELS[phase.type]}</span>
        <span className="display__time" aria-hidden="true">
          {formatMMSS(remainingMs / 1000)}
        </span>
      </div>
      {/* 매초 읽으면 방해가 되므로 단계가 바뀔 때만 알린다 */}
      <p className="sr-only" aria-live="polite">
        {PHASE_LABELS[phase.type]} {phase.durationSec}초
      </p>
    </div>
  );
}
