import { describe, expect, it } from 'vitest';
import { formatMMSS } from './format';

describe('formatMMSS', () => {
  it('설계서 케이스', () => {
    expect(formatMMSS(0)).toBe('00:00');
    expect(formatMMSS(59)).toBe('00:59');
    expect(formatMMSS(3600)).toBe('60:00');
  });

  it('분과 초를 자리수 맞춰 채운다', () => {
    expect(formatMMSS(5)).toBe('00:05');
    expect(formatMMSS(60)).toBe('01:00');
    expect(formatMMSS(90)).toBe('01:30');
    expect(formatMMSS(230)).toBe('03:50');
  });

  it('100분을 넘으면 분 자리가 늘어난다', () => {
    expect(formatMMSS(6000)).toBe('100:00');
  });

  it('음수는 00:00으로 막는다', () => {
    expect(formatMMSS(-1)).toBe('00:00');
  });

  it('소수는 올림(화면 숫자와 beep을 맞추기 위해)', () => {
    expect(formatMMSS(59.2)).toBe('01:00');
  });
});
