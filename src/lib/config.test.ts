import { describe, expect, it } from 'vitest';
import { BEEP_CHOICES, DEFAULT_CONFIG, clampConfig, clampField } from './config';

describe('clampField', () => {
  it('범위 아래 값은 최소값으로', () => {
    expect(clampField('workSec', -5)).toBe(1);
    expect(clampField('sets', 0)).toBe(1);
  });

  it('범위 위 값은 최대값으로', () => {
    expect(clampField('workSec', 9999)).toBe(3600);
    expect(clampField('prepSec', 400)).toBe(300);
    expect(clampField('cycles', 100)).toBe(99);
  });

  it('숫자가 아니면 기본값으로', () => {
    expect(clampField('workSec', NaN)).toBe(DEFAULT_CONFIG.workSec);
    expect(clampField('restSec', Infinity)).toBe(DEFAULT_CONFIG.restSec);
  });

  it('소수는 정수로 반올림', () => {
    expect(clampField('workSec', 20.7)).toBe(21);
  });

  it('0을 허용하는 항목은 0을 유지', () => {
    expect(clampField('prepSec', 0)).toBe(0);
    expect(clampField('restSec', 0)).toBe(0);
    expect(clampField('setRestSec', 0)).toBe(0);
  });
});

describe('clampConfig', () => {
  it('기본값은 그대로 통과', () => {
    expect(clampConfig(DEFAULT_CONFIG)).toEqual(DEFAULT_CONFIG);
  });

  it('객체가 아니면 전체 기본값', () => {
    expect(clampConfig(null)).toEqual(DEFAULT_CONFIG);
    expect(clampConfig('nope')).toEqual(DEFAULT_CONFIG);
    expect(clampConfig(undefined)).toEqual(DEFAULT_CONFIG);
  });

  it('빠진 키는 기본값으로 채움', () => {
    expect(clampConfig({ workSec: 30 })).toEqual({ ...DEFAULT_CONFIG, workSec: 30 });
  });

  it('모르는 키는 버림', () => {
    const out = clampConfig({ workSec: 30, nope: 1 });
    expect(Object.keys(out).sort()).toEqual(Object.keys(DEFAULT_CONFIG).sort());
  });

  it('손으로 고친 범위 밖 값도 범위 안으로', () => {
    expect(clampConfig({ workSec: -5, sets: 999 })).toEqual({
      ...DEFAULT_CONFIG,
      workSec: 1,
      sets: 99,
    });
  });

  it('beepAt은 1-10만 남기고 중복 제거, 내림차순', () => {
    expect(clampConfig({ beepAt: [0, 3, 11, 3, 1, 2.5, 'x'] }).beepAt).toEqual([3, 1]);
  });

  it('beepAt이 배열이 아니면 기본값', () => {
    expect(clampConfig({ beepAt: 3 }).beepAt).toEqual(DEFAULT_CONFIG.beepAt);
  });

  it('beepAt 빈 배열은 허용(알림 없음)', () => {
    expect(clampConfig({ beepAt: [] }).beepAt).toEqual([]);
  });
});

describe('BEEP_CHOICES', () => {
  it('1부터 10까지', () => {
    expect(BEEP_CHOICES).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
