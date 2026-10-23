export type TimerConfig = {
  prepSec: number;
  workSec: number;
  restSec: number;
  sets: number;
  cycles: number;
  setRestSec: number;
  beepAt: number[];
};

/** 숫자 설정 항목의 키 (beepAt 제외) */
export type NumericField = Exclude<keyof TimerConfig, 'beepAt'>;

export type FieldRange = {
  min: number;
  max: number;
  /** NumberStepper의 −/+ 증감 폭 */
  step: number;
  label: string;
};

export const FIELD_RANGES: Record<NumericField, FieldRange> = {
  prepSec: { min: 0, max: 300, step: 5, label: '준비 시간' },
  workSec: { min: 1, max: 3600, step: 5, label: '운동 시간' },
  restSec: { min: 0, max: 3600, step: 5, label: '휴식 시간' },
  sets: { min: 1, max: 99, step: 1, label: '세트 수' },
  cycles: { min: 1, max: 99, step: 1, label: '세트당 사이클' },
  setRestSec: { min: 0, max: 3600, step: 5, label: '세트 휴식' },
};

export const DEFAULT_CONFIG: TimerConfig = {
  prepSec: 10,
  workSec: 20,
  restSec: 10,
  sets: 3,
  cycles: 8,
  setRestSec: 60,
  beepAt: [3, 2, 1],
};

/** beep 시점으로 고를 수 있는 값. 0은 종료 순간이고 긴 beep이 담당하므로 제외 */
export const BEEP_CHOICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const NUMERIC_FIELDS = Object.keys(FIELD_RANGES) as NumericField[];

export function clampField(key: NumericField, value: unknown): number {
  const { min, max } = FIELD_RANGES[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_CONFIG[key];
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampBeepAt(value: unknown): number[] {
  if (!Array.isArray(value)) return DEFAULT_CONFIG.beepAt;
  const kept = BEEP_CHOICES.filter((n) => value.includes(n));
  return kept.sort((a, b) => b - a);
}

/** localStorage나 입력에서 온 임의의 값을 유효한 설정으로 정규화한다 */
export function clampConfig(raw: unknown): TimerConfig {
  const source = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const out = { beepAt: clampBeepAt(source.beepAt) } as TimerConfig;
  for (const key of NUMERIC_FIELDS) out[key] = clampField(key, source[key]);
  return out;
}
