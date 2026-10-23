# 운동 타이머 웹앱 설계서 (확정 스펙)

작성일: 2026-10-23 · 원 설계서(`운동 타이머 웹앱 설계서.md`)를 토대로 브레인스토밍에서 확정한 구현 스펙.

## 1. 개요

인터벌 운동(타바타, HIIT 등)을 위한 브라우저 기반 타이머. 사용자가 준비·운동·휴식·세트 구성을 설정하면 앱이 단계(Phase) 시퀀스를 만들어 순서대로 카운트다운하고, 지정한 시점에 beep 알림을 낸다.

| 항목 | 내용 |
| --- | --- |
| 기술스택 | React 18 + Vite + TypeScript |
| 상태관리 | React 내장 훅(useReducer) — 외부 라이브러리 없음 |
| 오디오 | Web Audio API (오실레이터로 beep 생성, 음원 파일 불필요) |
| 저장 | localStorage (마지막 설정 + 음소거 상태) |
| 테스트 | Vitest (순수 로직만) |
| 대상 기기 | 모바일 브라우저 우선, 데스크톱 지원 |

### 1.1 1차 범위

설정 화면, 실행 화면, 타이머 엔진, beep 알림, localStorage 저장·복원, Screen Wake Lock, 음소거 토글.

### 1.2 범위 밖

- **영구 제외**: 회원 기능, 서버, 운동 기록 통계. 모든 동작은 클라이언트에서만.
- **2차로 연기**: `navigator.vibrate` 진동, PWA(manifest + 서비스 워커), GitHub Actions 자동 배포, React Testing Library 기반 컴포넌트 테스트, 프리셋 저장, 음성 안내, 단계별 운동 이름.

연기 근거: 진동은 iOS 미지원으로 반쪽 기능. PWA는 브라우저에서 이미 동작하며 서비스 워커는 캐시 무효화 비용이 붙는다. 배포는 코어 동작 확인 후 한 커밋으로 끝난다.

## 2. 기능 요구사항

설정 항목은 F1–F7의 7개이고 F8은 설정이 아닌 흐름 규칙이다. 모든 시간은 초 단위로 저장하고 화면에는 mm:ss로 표시한다.

| ID | 기능 | 설정 키 | 입력 범위 | 기본값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| F1 | 운동 준비 시간 | `prepSec` | 0–300 | 10 | 시작 직후 1회만. 0이면 생략 |
| F2 | 운동 시간 | `workSec` | 1–3600 | 20 | 사이클마다 |
| F3 | 휴식 시간 | `restSec` | 0–3600 | 10 | 사이클 사이. 0이면 생략 |
| F4 | 세트 수 | `sets` | 1–99 | 3 | 전체 반복 세트 수 |
| F5 | 세트당 사이클 수 | `cycles` | 1–99 | 8 | 한 세트 안의 운동+휴식 반복 |
| F6 | 세트 종료 후 휴식 | `setRestSec` | 0–3600 | 60 | 세트 사이. 0이면 생략 |
| F7 | beep 알림 시점 | `beepAt` | 1–10, 복수 선택 | `[3, 2, 1]` | 단계 종료 N초 전 짧은 beep |
| F8 | 마지막 세트 종료 | (규칙) | — | — | 마지막 세트의 마지막 운동이 끝나면 휴식 없이 완료 |

공통 동작:

- 시작 / 일시정지 / 재개 / 리셋 / 다음 단계로 건너뛰기 / 음소거
- 마지막 설정과 음소거 상태는 localStorage에 저장해 재방문 시 복원
- 입력값은 범위로 클램프하고, 숫자가 아니면 기본값으로 되돌림

## 3. 타이머 흐름

운동이 끝날 때마다 두 가지를 판단한다: 이번이 세트의 마지막 사이클인가, 마지막 세트인가. 둘 다 "예"면 휴식 없이 완료한다(F8).

- 세트의 마지막 사이클 뒤에는 일반 휴식 대신 세트 휴식이 온다. 두 휴식이 연달아 나오지 않는다.
- 시간이 0인 단계는 시퀀스에서 빠진다.
- 실행 상태는 `idle → running ⇄ paused → finished`. 리셋은 어느 상태에서든 `idle`로 돌아간다.

## 4. 데이터 모델

시작 시 설정으로부터 Phase 배열을 한 번에 생성하고, 실행 중에는 배열 인덱스와 남은 시간만 갱신한다. 흐름 분기 로직이 생성 함수 하나에 모여 테스트가 쉬워진다.

```typescript
// 설정
type TimerConfig = {
  prepSec: number;
  workSec: number;
  restSec: number;
  sets: number;
  cycles: number;
  setRestSec: number;
  beepAt: number[]; // 1–10 중 복수
};

// 단계
type PhaseType = 'prep' | 'work' | 'rest' | 'setRest';
type Phase = {
  type: PhaseType;
  durationSec: number;
  set: number;   // 1부터
  cycle: number; // 1부터, prep/setRest는 0
};

// 재생할 소리
type BeepKind = 'short' | 'long' | 'finish';

// 실행 상태
type RunStatus = 'idle' | 'running' | 'paused' | 'finished';
type TimerState = {
  status: RunStatus;
  phases: Phase[];
  index: number;            // 현재 단계
  phaseEndsAt: number;      // performance.now() 기준 종료 시각(ms)
  remainingMs: number;      // 표시용 / 일시정지 시 남은 시간
  firedBeeps: number[];     // 현재 단계에서 이미 울린 beepAt 값
  pendingBeeps: BeepKind[]; // 재생 대기. useTimer가 재생 후 CONSUME_BEEPS로 비움
};
```

### 4.1 buildPhases

```typescript
function buildPhases(c: TimerConfig): Phase[] {
  const out: Phase[] = [];
  if (c.prepSec > 0) out.push({ type: 'prep', durationSec: c.prepSec, set: 1, cycle: 0 });
  for (let s = 1; s <= c.sets; s++) {
    for (let k = 1; k <= c.cycles; k++) {
      out.push({ type: 'work', durationSec: c.workSec, set: s, cycle: k });
      const lastCycle = k === c.cycles;
      if (!lastCycle && c.restSec > 0)
        out.push({ type: 'rest', durationSec: c.restSec, set: s, cycle: k });
    }
    const lastSet = s === c.sets;
    if (!lastSet && c.setRestSec > 0)
      out.push({ type: 'setRest', durationSec: c.setRestSec, set: s, cycle: 0 });
  }
  return out; // 마지막 원소는 항상 마지막 세트의 work (F8)
}
```

예: 준비 10 / 운동 20 / 휴식 10 / 2세트 × 3사이클 / 세트휴식 60 → 단계 12개, 총 230초(3:50) = `10 + 2×(3×20 + 2×10) + 60`.

## 5. 아키텍처 및 파일 구조

순수 로직(단계 생성, 리듀서)과 부수효과(시계, 오디오, 저장)를 분리한다. 로직은 React 없이 단위 테스트하고, 부수효과는 커스텀 훅에 가둔다.

```
src/
├── main.tsx
├── App.tsx                 # 설정 ↔ 실행 화면 전환
├── components/
│   ├── SettingsForm.tsx    # F1–F7 입력
│   ├── NumberStepper.tsx   # −/+ 5초 + type="number" 직접 입력
│   ├── BeepSelector.tsx    # beep 시점 1–10 칩 다중 선택
│   ├── Modal.tsx           # <dialog> 기반 확인 다이얼로그
│   ├── TimerDisplay.tsx    # 남은 시간 대형 숫자 + SVG 원형 진행바
│   ├── ProgressInfo.tsx    # 세트 2/3 · 사이클 5/8 · 전체 남은 시간
│   └── Controls.tsx        # 시작/일시정지/재개/건너뛰기/리셋/음소거
├── hooks/
│   ├── useTimer.ts         # 리듀서 + rAF 루프 + beep 재생 트리거
│   ├── useBeep.ts          # Web Audio 래퍼, 음소거 포함
│   ├── useWakeLock.ts      # 화면 꺼짐 방지
│   └── useLocalStorage.ts
└── lib/
    ├── buildPhases.ts      # 단계 시퀀스 생성(순수 함수)
    ├── timerReducer.ts     # START/TICK/PAUSE/RESUME/SKIP/RESET/CONSUME_BEEPS
    ├── config.ts           # 기본값, 범위, 검증·클램프
    └── format.ts           # mm:ss 포맷
```

| 계층 | 책임 | React 의존 |
| --- | --- | --- |
| `lib` | 단계 생성, 상태 전이, 검증, 포맷 | 없음 |
| `hooks` | 시간 측정, 소리, 화면 유지, 저장 | 있음 |
| `components` | 표시와 입력만 | 있음 |

`styles/` 디렉터리는 두지 않는다. 단계별 배경색은 CSS 변수로, 나머지는 컴포넌트별 CSS로 둔다 — 파일 10여 개짜리 앱에 스타일 계층을 분리하면 색 하나 찾으러 두 군데를 연다.

## 6. 타이머 엔진 및 beep 알림

시간은 `setInterval` 호출 횟수를 세지 않고 **종료 시각 기준**으로 계산한다. 탭 전환이나 기기 부하로 콜백이 늦어져도 누적 오차가 생기지 않는다.

### 6.1 틱 루프

- 단계 시작 시 `phaseEndsAt = performance.now() + durationSec × 1000`
- `requestAnimationFrame`(화면 표시용)과 250ms `setInterval`(백그라운드 대비)을 함께 사용. 둘 다 같은 `TICK` 액션을 보낸다
- 매 틱마다 `remainingMs = phaseEndsAt − now`
- `remainingMs ≤ 0`이면 다음 단계로 이동. 다음 단계의 종료 시각은 `이전 phaseEndsAt + 다음 durationSec × 1000`으로 계산해 초과된 시간이 자동으로 차감된다
- 마지막 단계가 끝나면 `status = 'finished'` (F8)
- 일시정지: `remainingMs` 저장 후 루프 중지 / 재개: `phaseEndsAt = now + remainingMs`

### 6.2 beep 규칙(F7)

| 시점 | 소리 | 조건 |
| --- | --- | --- |
| 종료 N초 전 (N ∈ `beepAt`) | `short` — 880Hz, 120ms | 남은 초가 N 이하로 처음 내려갈 때 1회 |
| 단계 종료 | `long` — 1320Hz, 400ms | 중간 단계 종료 시 |
| 운동 완료 | `finish` — 긴 beep 3회 | 마지막 단계(마지막 work) 종료 시 |

- 중복 방지: 울린 N을 `firedBeeps`에 기록하고 단계가 바뀌면 비운다
- 단계 길이보다 큰 N(예: 3초 단계에 5초 전 beep)은 무시
- 화면 숫자는 `Math.ceil(remainingMs / 1000)`으로 표시해 beep과 숫자가 맞는다

**소리 결정은 리듀서, 재생은 훅.** `TICK`이 `firedBeeps`를 보고 재생할 소리를 `pendingBeeps`에 **누적**하고, `useTimer`가 그것을 읽어 `useBeep`을 호출한 뒤 `CONSUME_BEEPS`로 비운다. 덮어쓰지 않고 누적·명시적 소비로 처리하는 이유: rAF와 250ms interval의 `TICK`이 한 React 배치에 묶이면 덮어쓰기 방식에서는 앞선 틱의 소리가 유실된다.

이 분리 덕분에 beep 판단 로직 전체가 Web Audio 없이 순수 함수 테스트로 검증된다.

### 6.3 오디오 구현

- `AudioContext`는 첫 "시작" 버튼 클릭 시 생성·`resume` (iOS Safari 자동재생 정책)
- `OscillatorNode` + `GainNode`로 생성, 끝부분을 짧게 페이드아웃해 딸깍 잡음 제거
- 음소거 토글 제공. 음소거 시 `pendingBeeps`는 소비하되 재생하지 않는다

### 6.4 백그라운드 대응

- Screen Wake Lock API로 실행 중 화면 꺼짐 방지. 미지원 브라우저는 안내 문구 표시
- `visibilitychange`로 복귀하면 `now` 기준으로 즉시 재계산해 지나간 단계를 건너뛴다
- **건너뛴 단계의 beep은 울리지 않는다.** 한 번의 `TICK`에서 단계가 2개 이상 넘어가면(= 따라잡기) `short`·`long`을 내지 않는다. 모든 단계가 지나갔으면 `finished`로 가고 `finish`만 1회 낸다. 10분 뒤 복귀 시 지나간 beep을 몰아 재생하면 소음이다
- 백그라운드 탭에서는 브라우저가 타이머를 제한해 beep이 늦을 수 있음을 화면에 안내

## 7. UI/UX 화면 설계

화면은 설정과 실행 두 개. 실행 화면은 운동 중 멀리서도 읽히도록 숫자와 색을 크게 쓴다.

### 7.1 설정 화면

- 항목별 `NumberStepper`: −/+ 버튼은 시간 항목에서 **5초씩**, 횟수 항목(`sets`, `cycles`)은 1씩 증감. 길게 누르면 연속 증감
- 숫자를 탭하면 `<input type="number" inputMode="numeric">`으로 초 단위 직접 입력. mm:ss 파서는 만들지 않고 **표시만** `format.ts`의 mm:ss로 한다
- beep 시점: 1–10 칩 다중 선택
- 하단 요약: 총 단계 수와 총 소요 시간을 실시간 표시
- "시작" 버튼: 화면 하단 고정, 높이 56px 이상

### 7.2 실행 화면

| 영역 | 내용 |
| --- | --- |
| 상단 | 단계명(준비/운동/휴식/세트 휴식), 세트 2/3 · 사이클 5/8 |
| 중앙 | 남은 시간 대형 숫자 + SVG 원형 진행바 |
| 하단 정보 | 다음 단계 미리보기, 전체 남은 시간 |
| 컨트롤 | 일시정지/재개, 건너뛰기, 리셋(확인 후), 음소거 |
| 완료 | "운동 완료" 메시지, 총 소요 시간, 다시 시작 버튼 |

단계별 배경색: 준비 노랑 / 운동 빨강 / 휴식 초록 / 세트 휴식 파랑.

원형 진행바는 SVG `<circle>` + `stroke-dasharray`·`stroke-dashoffset`으로 그린다. 차트 라이브러리 없음.

접근성: 색만으로 구분하지 않고 단계명을 항상 함께 표시. 스페이스바로 일시정지/재개. 남은 시간은 `aria-live`로 단계 전환 시에만 읽는다.

## 8. 확정 결정 사항

원 설계서에 없거나 서로 어긋난 지점을 다음과 같이 확정했다.

1. **beep 칩 범위는 1–10.** 원 설계서 F7 표는 `0–10`, 7.1은 `1~10`으로 어긋났다. "0초 전"은 종료 순간이고 그건 `long`/`finish` beep이 담당해 중복이므로 0을 제외한다.
2. **완료 화면의 "총 소요 시간"은 계획 총시간**(`phases`의 `durationSec` 합). 실제 경과 시간이 아니다. 실제 경과를 쓰면 일시정지한 시간이 운동 시간에 섞여 숫자가 거짓이 되고 `startedAt`·누적 일시정지 시간을 따로 추적해야 한다. 계획 총시간은 설정 화면 요약이 이미 계산하는 값이라 추가 코드가 없다.
3. **실행 중 설정 잠금은 별도 코드가 필요 없다.** `App`이 설정 ↔ 실행 화면을 전환하므로 `running` 중에는 설정 폼이 마운트되지 않는다. 화면 전환으로 요구가 자동 충족된다.
4. **백그라운드 복귀 시 건너뛴 단계의 beep은 울리지 않는다.** (6.4 참조)
5. **SKIP은 앞으로만, `paused` 상태에서도 허용.** `paused` 중 건너뛰면 다음 단계에서 `paused`를 유지하고 자동 재생하지 않는다. "이전 단계로"는 요구에 없어 만들지 않는다.
6. **리셋 확인은 `components/Modal.tsx` 커스텀 모달.** 네이티브 `<dialog>` + `showModal()` 기반으로 만들어 포커스 트랩·ESC 닫기·배경 `inert`·`aria-modal`을 브라우저에 맡긴다. 인터페이스는 `{ open, title, confirmLabel, onConfirm, onCancel, children }`. 1차 사용처는 리셋 확인 하나지만 2차 프리셋 삭제·덮어쓰기 확인이 같은 모양이라 재사용된다. 지원 범위는 Safari 15.4+ 포함 전 모던 브라우저.
7. **localStorage가 비었거나 깨졌으면 기본값.** `JSON.parse`를 `try/catch`로 감싸고, 읽어온 값도 `config.ts`의 클램프를 통과시킨다 — 손으로 고친 localStorage에 `workSec: -5`가 있어도 범위 안으로 들어온다. 음소거 상태도 같은 키에 함께 저장한다.
8. **시간 입력은 −/+ 스텝 + `type="number"`**, mm:ss 입력 파서 없음. (7.1 참조)

## 9. 테스트 계획

Vitest만 사용한다. React Testing Library와 jsdom은 도입하지 않는다 — 이 앱의 버그는 거의 전부 시퀀스 생성과 시간 계산에서 나오고 그것은 모두 React 밖이다. 컴포넌트 동작은 브라우저에서 손으로 확인한다.

| 대상 | 케이스 | 기대 결과 |
| --- | --- | --- |
| `config` | 음수·범위 초과·NaN 입력 | 범위로 클램프, NaN은 기본값 |
| `buildPhases` | 1세트 × 1사이클 | `[prep, work]`만, 휴식 없음 |
| `buildPhases` | 3세트 × 4사이클 | work 12개, rest 9개, setRest 2개 |
| `buildPhases` | 마지막 원소 | 항상 마지막 세트의 work (F8) |
| `buildPhases` | `prepSec`/`restSec`/`setRestSec` = 0 | 해당 단계 생략 |
| `format` | 0초 / 59초 / 3600초 | `00:00` / `00:59` / `60:00` |
| 리듀서 | 일시정지 후 재개 | 남은 시간 유지 |
| 리듀서 | 틱이 2초 늦음 | 넘친 시간이 다음 단계 종료 시각에서 차감 |
| 리듀서 | 한 틱에 단계 2개 이상 경과 | `short`·`long` 없음(따라잡기) |
| 리듀서 | `paused`에서 SKIP | 다음 단계, 상태는 `paused` 유지 |
| beep | `beepAt = [5, 3]` | 단계마다 5초·3초 전 1회씩, 종료 시 `long` |
| beep | 단계 3초, `beepAt = [5]` | 울리지 않음 |
| beep | 마지막 단계 종료 | `finish` 1회 (`long` 아님) |
| 수동 | iOS Safari, Android Chrome | 첫 탭 후 소리 재생, 화면 꺼짐 방지 동작 |

## 10. 구현 순서

각 단계는 검증을 통과한 뒤 다음으로 넘어간다. 2–5번은 테스트를 먼저 쓴다(TDD).

| # | 작업 | 검증 |
| --- | --- | --- |
| 1 | Vite + React + TS + Vitest 스캐폴드 | `npm test` 통과, `npm run dev` 화면 표시 |
| 2 | `lib/config.ts` 기본값·범위·클램프 | 음수·초과·NaN이 범위 안으로 |
| 3 | `lib/buildPhases.ts` | 9장 `buildPhases` 4케이스 통과 |
| 4 | `lib/format.ts` | 9장 `format` 케이스 통과 |
| 5 | `lib/timerReducer.ts` | 9장 리듀서·beep 7케이스 통과 |
| 6 | `useBeep` · `useTimer` · `useLocalStorage` · `useWakeLock` | 브라우저 1회 실행, 소리·화면 유지 확인 |
| 7 | `SettingsForm` · `NumberStepper` · `BeepSelector` · `Modal` | 입력·칩·요약·확인 다이얼로그 동작 |
| 8 | `TimerDisplay` · `ProgressInfo` · `Controls` · `App` 전환 | 짧은 설정(prep 3 / work 3 / 1세트 2사이클)으로 완주 |
