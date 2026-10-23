import { BEEP_CHOICES } from '../lib/config';

type Props = {
  value: number[];
  onChange: (value: number[]) => void;
};

export function BeepSelector({ value, onChange }: Props) {
  const toggle = (n: number) => {
    const next = value.includes(n) ? value.filter((v) => v !== n) : [...value, n];
    onChange(next.sort((a, b) => b - a));
  };

  return (
    <fieldset className="beeps">
      <legend className="beeps__legend">알림 시점 (종료 몇 초 전)</legend>
      <div className="beeps__chips">
        {BEEP_CHOICES.map((n) => {
          const on = value.includes(n);
          return (
            <button
              key={n}
              type="button"
              className={`chip${on ? ' chip--on' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(n)}
            >
              {n}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
