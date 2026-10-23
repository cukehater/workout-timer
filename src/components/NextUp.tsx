import { PHASE_LABELS, type Phase } from '../lib/buildPhases';
import { formatMMSS } from '../lib/format';

type Props = {
  next?: Phase;
};

export function NextUp({ next }: Props) {
  if (!next) return <p className="next">마지막 단계</p>;

  return (
    <p className="next">
      <span className="next__dot" data-phase={next.type} aria-hidden="true" />
      다음 <b className="next__name">{PHASE_LABELS[next.type]}</b>
      <span className="next__time">{formatMMSS(next.durationSec)}</span>
    </p>
  );
}
