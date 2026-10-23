import { BEEP_CHOICES } from '../lib/config';

type Props = {
  value: number[];
  onChange: (value: number[]) => void;
};

/** 대부분은 이 중 하나다. 직접 고르기는 그 아래에 남겨둔다 */
const PRESETS: { label: string; value: number[] }[] = [
  { label: '끄기', value: [] },
  { label: '마지막 3초', value: [3, 2, 1] },
  { label: '마지막 5초', value: [5, 4, 3, 2, 1] },
  { label: '10초 전부터', value: [10, 5, 3, 2, 1] },
];

const same = (a: number[], b: number[]) =>
  a.length === b.length && a.every((n, i) => n === b[i]);

export function BeepSelector({ value, onChange }: Props) {
  const toggle = (n: number) => {
    const next = value.includes(n) ? value.filter((v) => v !== n) : [...value, n];
    onChange(next.sort((a, b) => b - a));
  };

  const preset = PRESETS.find((p) => same(p.value, value));

  return (
    <fieldset className="beeps">
      <legend className="sr-only">신호음 시점</legend>

      <p className="beeps__summary">
        {value.length === 0 ? (
          '신호음이 울리지 않습니다'
        ) : (
          <>
            단계가 끝나기 <b>{value.join('·')}초</b> 전에 신호음이 울립니다
          </>
        )}
      </p>

      <div className="beeps__presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className={`preset${preset === p ? ' preset--on' : ''}`}
            aria-pressed={preset === p}
            onClick={() => onChange(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 프리셋에 없는 조합을 쓰는 중이면 펼친 채로 보여준다 */}
      <details className="beeps__custom" open={!preset}>
        <summary className="beeps__toggle">직접 고르기</summary>
        <p className="beeps__help">종료 몇 초 전에 울릴지 고르세요</p>
        <div className="beeps__chips">
          {BEEP_CHOICES.map((n) => {
            const on = value.includes(n);
            return (
              <button
                key={n}
                type="button"
                className={`chip${on ? ' chip--on' : ''}`}
                aria-pressed={on}
                aria-label={`${n}초 전`}
                onClick={() => toggle(n)}
              >
                {n}
              </button>
            );
          })}
        </div>
      </details>
    </fieldset>
  );
}
