import { PHASE_LABELS, type Phase, remainingTotalSec } from '../lib/buildPhases';
import { formatMMSS } from '../lib/format';

type Props = {
  phases: Phase[];
  index: number;
  remainingMs: number;
  sets: number;
  cycles: number;
};

export function ProgressInfo({ phases, index, remainingMs, sets, cycles }: Props) {
  const phase = phases[index];
  const next = phases[index + 1];

  return (
    <div className="progress">
      <div className="progress__counts">
        <span>
          세트 <strong>{phase.set}</strong>/{sets}
        </span>
        <span>
          사이클 <strong>{phase.cycle || '-'}</strong>/{cycles}
        </span>
      </div>
      <div className="progress__next">
        {next ? `다음: ${PHASE_LABELS[next.type]} ${formatMMSS(next.durationSec)}` : '마지막 단계'}
      </div>
      <div className="progress__total">
        전체 남은 시간 {formatMMSS(remainingTotalSec(phases, index, remainingMs))}
      </div>
    </div>
  );
}
