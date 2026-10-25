import { type Phase, remainingTotalSec } from '../lib/buildPhases';
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

  return (
    <div className="meta">
      <span className="meta__item">
        세트 <b className="meta__value">{phase.set}</b>
        <span className="meta__of">/{sets}</span>
      </span>
      {/* 준비·세트 휴식에는 사이클이 없다. 자리표시자를 보여주느니 항목을 뺀다 */}
      {phase.cycle > 0 && (
        <span className="meta__item">
          사이클 <b className="meta__value">{phase.cycle}</b>
          <span className="meta__of">/{cycles}</span>
        </span>
      )}
      <span className="meta__item meta__item--total">
        종료까지{' '}
        <b className="meta__value">{formatMMSS(remainingTotalSec(phases, index, remainingMs))}</b>
      </span>
    </div>
  );
}
