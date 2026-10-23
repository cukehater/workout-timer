/**
 * 초를 mm:ss로. 올림을 쓰는 이유는 화면 숫자와 beep 시점을 맞추기 위해서다
 * (남은 0.2초는 "1초"로 보여야 종료 1초 전 beep과 어긋나지 않는다).
 */
export function formatMMSS(seconds: number): string {
  const total = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
