import { PHASE_LABELS, type Phase } from '../lib/buildPhases';
import { formatMMSS } from '../lib/format';

const RADIUS = 84;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  phase: Phase;
  remainingMs: number;
  running: boolean;
};

export function TimerDisplay({ phase, remainingMs, running }: Props) {
  const totalMs = phase.durationSec * 1000;
  const elapsed = totalMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / totalMs)) : 1;
  const seconds = Math.ceil(remainingMs / 1000);
  // 마지막 3초는 beep과 같은 박자로 숫자가 한 번 뛴다
  const countdown = running && seconds > 0 && seconds <= 3;

  return (
    <div className="dial">
      <svg className="dial__ring" viewBox="0 0 200 200" aria-hidden="true">
        <circle className="dial__track" cx="100" cy="100" r={RADIUS} />
        <circle
          className="dial__progress"
          cx="100"
          cy="100"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * elapsed}
        />
      </svg>
      <div className="dial__center">
        {/* 색만으로 구분하지 않도록 단계명을 항상 함께 보여준다 */}
        <span className="dial__phase">{PHASE_LABELS[phase.type]}</span>
        <span
          className={`dial__time${countdown ? ' dial__time--countdown' : ''}`}
          key={countdown ? seconds : 'steady'}
          aria-hidden="true"
        >
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
