import { useEffect, useRef } from 'react';
import { FIELD_RANGES, clampField, type NumericField } from '../lib/config';
import { formatMMSS } from '../lib/format';

const HOLD_DELAY_MS = 400;
const HOLD_REPEAT_MS = 80;

type Props = {
  field: NumericField;
  value: number;
  /** 초 단위 항목이면 mm:ss 보조 표시를 붙인다 */
  isTime?: boolean;
  onChange: (value: number) => void;
};

export function NumberStepper({ field, value, isTime = false, onChange }: Props) {
  const { min, max, step, label } = FIELD_RANGES[field];

  // 길게 누르는 동안 setInterval 안에서 최신 값을 읽어야 한다
  const valueRef = useRef(value);
  valueRef.current = value;
  const holdRef = useRef<{ delay?: number; repeat?: number }>({});

  const bump = (dir: 1 | -1) => onChange(clampField(field, valueRef.current + dir * step));

  const stopHold = () => {
    clearTimeout(holdRef.current.delay);
    clearInterval(holdRef.current.repeat);
    holdRef.current = {};
  };

  const startHold = (dir: 1 | -1) => {
    bump(dir);
    holdRef.current.delay = window.setTimeout(() => {
      holdRef.current.repeat = window.setInterval(() => bump(dir), HOLD_REPEAT_MS);
    }, HOLD_DELAY_MS);
  };

  useEffect(() => stopHold, []);

  return (
    <div className="row">
      <span className="row__label" id={`${field}-label`}>
        {label}
        {isTime && <span className="row__hint">{formatMMSS(value)}</span>}
      </span>
      <div className="stepper">
        <button
          type="button"
          className="stepper__btn"
          aria-label={`${label} 줄이기`}
          disabled={value <= min}
          onPointerDown={() => startHold(-1)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <label className="stepper__field">
          <input
            type="number"
            inputMode="numeric"
            className="stepper__input"
            aria-labelledby={`${field}-label`}
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(clampField(field, e.currentTarget.valueAsNumber))}
          />
          <span className="stepper__unit">{isTime ? '초' : '회'}</span>
        </label>
        <button
          type="button"
          className="stepper__btn"
          aria-label={`${label} 늘리기`}
          disabled={value >= max}
          onPointerDown={() => startHold(1)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
