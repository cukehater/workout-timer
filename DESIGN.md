---
name: 운동 타이머
description: 1~2m 거리에서 읽히는 인터벌 타이머 — 근-검정 지면 위에서 단계 색이 화면 전체를 지배한다.
colors:
  bg: "#0A0B0D"
  surface: "#14161A"
  surface-2: "#1B1E24"
  line: "#262A32"
  fg: "#F4F6F8"
  fg-dim: "#9BA3AF"
  fg-faint: "#7B8392"
  accent: "#CCFF4D"
  danger: "#FF5A5A"
  prep: "#FFC53D"
  work: "#FF5A3C"
  rest: "#2FD49B"
  set-rest: "#5B8DEF"
  ground-prep: "#201D11"
  ground-work: "#201211"
  ground-rest: "#0D1D1A"
  ground-set-rest: "#111721"
typography:
  display:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "min(calc(140vw / var(--chars, 5)), 32dvh, 180px)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tabular-nums"
  dial:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "calc(var(--dial) * 0.245)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tabular-nums"
  phase:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "max(15px, calc(var(--dial) * 0.075))"
    fontWeight: 900
    letterSpacing: "0.08em"
  headline:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "28px"
    fontWeight: 900
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "17px"
    fontWeight: 700
  body:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "'Pretendard Variable', Pretendard, system-ui, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  dot: "3px"
  sm: "10px"
  chip: "12px"
  md: "14px"
  lg: "18px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "18px"
  2xl: "22px"
components:
  button:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "56px"
    typography: "{typography.title}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "56px"
  button-phase:
    backgroundColor: "var(--phase)"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "56px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "56px"
  button-start:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    width: "100%"
    height: "60px"
  button-ghost:
    backgroundColor: "rgba(0, 0, 0, 0.32)"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "56px"
  panel-rows:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "0"
  row:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    padding: "10px 12px 10px 16px"
    height: "64px"
    typography: "{typography.title}"
  stepper:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "4px"
  stepper-button:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.sm}"
    size: "46px"
  preset:
    backgroundColor: "transparent"
    textColor: "{colors.fg-dim}"
    rounded: "{rounded.chip}"
    padding: "0 10px"
    height: "46px"
  preset-on:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.chip}"
  chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.fg-dim}"
    rounded: "{rounded.chip}"
    height: "46px"
  chip-on:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.chip}"
  modal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "20px"
    width: "22rem"
---

# Design System: 운동 타이머

## Overview

**Creative North Star: "The Lit Dial in a Dark Room"**

이 시스템은 비유를 입지 않는다. 인터벌 타이머가 실제로 출시되는 형태 — 어두운 지면, 단계 색 원형 진행 링, 거대한 남은 시간, 하단 컨트롤 바 — 를 변주 없이 치되, 동종 앱보다 한 단계 더 정확하게 친다. 사용자가 비주얼 방향 선택에서 일곱 개의 비유적 세계(복싱·트랙·수영 계시판·환승안내·체육대회·태권도·등산표지)를 보고 카테고리 표준을 의도적으로 고른 결과다. 품질 바는 Tabata/HIIT 전용 타이머 앱과 Apple 피트니스이고, 겨루는 지점은 발명이 아니라 완성도다.

세계를 지배하는 것은 팔레트가 아니라 **단계**다. 설정 화면과 완료 화면은 근-검정 지면(#0A0B0D) 위의 조용한 목록이지만, 운동이 시작되는 순간 화면 전체가 현재 단계의 색으로 갈아입는다. 링, 단계명, 주행동 버튼이 한 색을 공유하고, 지면마저 그 색을 9%만 섞은 값으로 바뀐다. 9%는 임의의 수가 아니라 링이 바탕에서 떨어져 나오는 최소치다 — 더 섞으면 링이 묻히고, 안 섞으면 1~2m 거리에서 단계 전환이 곁눈질로 읽히지 않는다.

밀도는 두 화면이 정반대다. 설정 화면은 섹션 목록으로 조밀하게(64px 행, 1px 머리카락 선, 30rem 단일 열), 실행 화면은 성기고 크게(뷰포트 비례 다이얼, 다이얼의 24.5%짜리 숫자, 그 외에는 거의 아무것도 없이). 장식은 0이다 — 그라디언트도, 글라스도, 그림자도, 글리프 아이콘도 없다. 깊이는 색조 단차 세 단과 머리카락 선 하나로만 만든다.

**Key Characteristics:**
- 근-검정 지면 위, 단계 색이 화면 전체를 몰고 다니는 다크 온리 세계
- 그림자 0개 — 깊이는 #0A0B0D → #14161A → #1B1E24 색조 단차와 1px #262A32 선으로만
- Pretendard Variable 한 가족, 네 단(900/800/700/500), 모든 숫자는 tabular-nums
- 다이얼은 px이 아니라 뷰포트에서 계산되고, 그 안의 숫자는 다이얼에서 계산된다
- 저작된 모션은 평생 두 개 — 다이얼 진입, 마지막 3초 틱. 둘 다 보이는 상태에서 출발한다
- 어떤 뷰포트에서도 2열로 분기하지 않는다

## Colors

근-검정 중성 축 위에 고채도 단계 색 네 개와 라임 정체성 색 하나만 올린 팔레트. 중성은 전부 약한 청색 기미를 공유하고, 유채색은 전부 지면보다 훨씬 밝다.

### Primary

- **라임 시그널 (Lime Signal)** (`{colors.accent}`): 앱의 정체성 색. 설정 화면의 '시작' 버튼, 선택된 신호음 프리셋과 칩, 완료 화면의 총 시간과 '다시 시작'에만 쓴다. 실행 화면 콘텐츠에는 절대 등장하지 않는다 — 운동 중 화면은 단계 색의 것이다. 브라우저 표면(`::selection`, `caret-color`, `:focus-visible` 링)에서는 전역으로 쓰인다.

### Secondary — 단계 색

실행 화면의 링·단계명·주행동 버튼이 `--phase`로 함께 소비한다. 의미는 PRODUCT.md가 고정하고(준비=대기, 운동=강한 신호, 휴식=차분, 세트 휴식=구분), 색값은 이 시스템이 고정한다.

- **준비 앰버 (Prep Amber)** (`{colors.prep}`): 카운트인. 출발 전의 노란 신호.
- **운동 코랄레드 (Work Coral-Red)** (`{colors.work}`): 네 색 중 가장 센 신호. 화면에서 가장 오래 머문다.
- **휴식 민트 (Rest Mint)** (`{colors.rest}`): 차가운 쪽으로 완전히 넘어가 운동과 혼동되지 않는다.
- **세트 휴식 블루 (Set-Rest Blue)** (`{colors.set-rest}`): 긴 휴식. 세트 경계를 색만으로도 구분시킨다.

### Tertiary — 단계 지면

각 단계 색을 근-검정에 9% 섞은 값. `.screen[data-phase]`가 `--ground`로 깔고, `<meta name="theme-color">`까지 같은 값을 따라가 폰 브라우저 상단 바가 함께 바뀐다.

- **앰버 그라운드** (`{colors.ground-prep}`) / **코랄 그라운드** (`{colors.ground-work}`) / **민트 그라운드** (`{colors.ground-rest}`) / **블루 그라운드** (`{colors.ground-set-rest}`)

### Neutral

- **근-검정 (Near-Black)** (`{colors.bg}`): 설정·완료 화면의 지면, 그리고 모든 밝은 버튼 위의 글자색. `color-scheme: dark`와 `theme-color` 기본값.
- **올린 표면 (Raised Surface)** (`{colors.surface}`): 설정 패널과 모달의 바탕. 지면에서 한 단 올라온 유일한 면.
- **눌린 표면 (Inset Surface)** (`{colors.surface-2}`): 패널 안으로 다시 들어간 면 — 기본 버튼, 스테퍼 트레이, 선택되지 않은 칩.
- **머리카락 선 (Hairline)** (`{colors.line}`): 패널 테두리, 행 구분선, 설정 푸터 상단선, 스크롤바 썸. 1px 고정.
- **본문 흰색 (Paper White)** (`{colors.fg}`): 본문과 수치.
- **흐린 회색 (Dimmed)** (`{colors.fg-dim}`) / **더 흐린 회색 (Faint)** (`{colors.fg-faint}`): 라벨, 보조 수치, 안내문. 단, 색이 든 지면 위에서는 쓰지 않는다(아래 규칙).
- **위험 레드 (Danger Red)** (`{colors.danger}`): 리셋 확인 모달의 파괴적 행동 버튼 하나뿐.

### Named Rules

**The Phase Owns the Screen Rule.** 실행 중에는 링, 단계명, 주행동 버튼, 지면이 모두 같은 `--phase`/`--ground` 쌍을 쓴다. 실행 화면에 단계 색과 무관한 유채색을 들이지 않는다 — 유일한 예외는 다음 단계를 예고하는 10px 점과 전역 포커스 링이다.

**The 9% Ground Rule.** 단계 지면은 단계 색을 9%만 섞는다. 그 이상이면 링이 바탕에 묻히고, 0이면 곁눈질로 단계 전환을 놓친다. 새 단계 색을 추가하려면 지면 값도 같은 비율로 함께 만든다.

**The Lime Stays Off the Mat Rule.** 라임은 설정·완료 화면의 주행동과 선택 상태에만 쓴다. 운동 중 화면에서 라임이 보이면 그것은 단계 색과 경쟁하는 것이다. 포커스 링(`3px solid`, offset 3px)만 전역 예외다.

**The Grey Comes From the Ground Rule.** 색이 든 지면 위에서는 중성 회색(`{colors.fg-dim}`/`{colors.fg-faint}`)이 뜬다. `.screen--run`은 두 토큰을 흰색 알파(0.74 / 0.54)로 다시 정의한다. 새 단계 화면을 만들면 같은 재정의를 따른다.

**The Name Beside the Colour Rule.** 단계는 색만으로 전달하지 않는다. 링 안에는 항상 단계명이 같은 색으로 함께 있고, 다음 단계 줄에는 점 + 이름 + 시간이 함께 있다. 색각 이상에서도 읽혀야 한다.

## Typography

**Display Font:** Pretendard Variable (fallback: Pretendard, system-ui, -apple-system, sans-serif)
**Body Font:** 동일
**Label/Mono Font:** 동일 — `--font-num`은 별도 가족이 아니라 같은 가족의 별칭이다

자가 호스팅(v1.3.9, OFL): 이 앱이 실제로 쓰는 글리프만 담은 dynamic-subset 10덩어리(`src/fonts/subset.80–91.woff2`), `font-weight: 45 920` 가변 축, `font-display: swap`. CDN 의존 없이 오프라인에서도 같은 활자가 뜬다.

**Character:** 한 가족 안에서 네 단(900 / 800 / 700 / 500)만 쓴다. 본문 기본값이 이미 700이라 전체가 단단하고, 큰 숫자에서 음수 자간(-0.03em)으로 조여 덩어리로 읽히게 한다. 중립적이고 기하학적인 한글 산세리프라 어떤 단계 색 위에서도 색을 타지 않는다.

### Hierarchy

- **Display** (900, `{typography.display.fontSize}`, lh 1, -0.03em): 완료 화면의 총 운동 시간. 단 하나의 용도. 크기를 글자 수(`--chars`)로 나눠 `100:00`까지 잘리지 않는다.
- **Dial** (800, `{typography.dial.fontSize}`, lh 1, -0.03em, 흰색 고정): 실행 화면의 남은 시간. 다이얼 지름의 24.5%.
- **Phase** (900, `{typography.phase.fontSize}`, +0.08em, 단계 색): 링 안의 단계명. 최소 15px 바닥을 둬 작은 다이얼에서도 읽힌다.
- **Headline** (900, 28px → 태블릿 34px → 낮은 가로 22px, -0.02em): 설정 화면 제목(운동 타이머), 완료 화면 제목(30px).
- **Title** (700, 17px): 설정 행 라벨, 버튼 라벨(800, 17px), 상단 메타 수치는 원거리용으로 따로 키운다(900, `--meta-num: clamp(30px, 5dvh, 52px)`, 가로 `clamp(30px, 10dvh, 80px)`). 분모(`/3`)는 ×0.5, 종료까지는 ×0.6에 흐린 색 — 세트 숫자와 겨루지 않는다.
- **Body** (500, 15px, lh 1.5): 모달 본문, 완료 화면 상세, 신호음 요약(14px).
- **Label** (700, 13px, +0.06em, `{colors.fg-dim}`): 섹션 머리말(시간·반복·알림), 단위(초/회), 스테퍼 보조 표시(500).
- **Note** (500, 12.5px, lh 1.5, `{colors.fg-faint}`, max 34ch, `text-wrap: balance`): 실행 화면 하단 안내문.

### Named Rules

**The One Family Rule.** 활자는 Pretendard Variable 한 가족이다. 숫자 전용 폰트를 들이지 않는다 — 자리폭은 `font-variant-numeric: tabular-nums`가 잡는다. 시간·세트·사이클·칩 숫자가 모두 이 선언을 달고 있어 매초 갱신돼도 글자가 흔들리지 않는다.

**The Dial Sets the Type Rule.** 세로 실행 화면의 활자 크기는 px이 아니라 다이얼에서 계산된다(시간 ×0.245, 단계명 ×0.1). 다이얼이 작아지면 글자도 같이 작아지므로 어떤 뷰포트에서도 링 안에서 넘치지 않는다. 가로 모드는 링이 없으므로 시간을 `min(22vw, 44dvh)`로 뷰포트에서 직접 계산한다. 메타·다음 단계는 `clamp(최소px, dvh, 최대px)`로 멀리서 읽히는 크기를 지킨다.

**The Korean Doesn't Break Mid-Word Rule.** `word-break: keep-all`이 전역이다. 한국어는 어절 중간에서 끊지 않는다. 좁은 폭에서 줄이 늘어나는 쪽을 택하고, 그래서 버튼과 칩은 `white-space: nowrap`으로 따로 지킨다.

## Layout

**단일 열이 전부다.** 설정 화면은 `max-width: 30rem`(태블릿 34rem) 중앙 정렬 한 열, 실행 화면은 세로 플렉스 한 열, 완료 화면도 한 열. 어떤 뷰포트에서도 2열로 분기하지 않는다. 가로 모드 실행 화면만 예외로 링을 숨기고 숫자를 키운다(2026-10-25, 원거리 가독성 우선).

**지면 패딩:** 상단 20px, 좌우·하단 16px에 `env(safe-area-inset-*)`를 더한다. 화면 높이는 `100dvh`(모바일 주소창 보정).

**실행 화면 수직 리듬:** `gap: clamp(14px, 3.2vh, 28px)`, `justify-content: safe center` — 내용이 뷰포트보다 커져도 위쪽이 잘리지 않는다. 위에서부터 메타 한 줄 → 다이얼 → 다음 단계 한 줄. 컨트롤(`max-width: 26rem`, 태블릿 32rem)과 안내문은 `.dock`에 담겨 화면 하단에 고정으로 겹쳐 뜬다 — 평소 opacity 0·`pointer-events: none`이라 숨은 버튼 자리를 눌러도 동작하지 않고 컨트롤만 뜬다. 떠도 타이머 배치는 움직이지 않는다.

**설정 화면 리듬:** 섹션 간 22px(태블릿 26px), 머리말과 패널 사이 8px, 행 높이 64px. 하단에는 요약 + 시작 버튼이 `position: sticky; bottom: 0`으로 붙어 지면색 바탕과 1px 상단선을 달고 따라온다.

**다이얼 크기 (시스템의 핵심 반응형 값):**

| 조건 | `--dial` |
| --- | --- |
| 세로(기본) | `min(90vw, 58dvh, 520px)` |
| 가로 | 링 숨김, 시간 `min(22vw, 44dvh)`, 단계명 `clamp(26px, 11dvh, 96px)`, 하단 가장자리 진행 바(`clamp(16px, 4.5dvh, 36px)`) |

컨트롤이 평소 숨어 있으므로 그 높이를 다이얼이 가져간다. 상한 520px은 데스크톱에서 다이얼이 비정상적으로 커지는 것을 막는다.

**브레이크포인트:**
- `max-width: 480px` — 주행동 버튼이 컨트롤 바 한 줄을 통째로 가져간다(`flex: 1 0 100%`).
- `(orientation: landscape) and (max-height: 520px)` — 수직 패딩 10px, 안내문 숨김, 제목 22px.
- `(orientation: landscape)` — 실행 화면에서 링을 숨기고 숫자·메타·다음 단계를 키우며 진행 바를 띄운다(폰·태블릿 공통).
- `(min-width: 48rem) and (min-height: 600px)` — 설정 폭·제목·버튼을 한 단씩 키운다. 높이 조건이 있어 가로 폰이 태블릿 규칙에 걸리지 않는다.

### Named Rules

**The One Column Rule.** 폭이 아무리 넓어져도 2열로 분기하지 않는다. 데스크톱은 '큰 모바일'이다 — 여백이 늘고 다이얼이 커질 뿐 배치는 같다.

**The Thumb Owns the Row Rule.** 480px 미만에서 주행동(일시정지/재개)은 한 줄 전체를 차지한다. 숨찬 상태에서 엄지로 잘못 누를 수 없어야 한다. 터치 타겟은 버튼 56px(태블릿 60px), 스테퍼·칩·프리셋 46px로 최소 44px를 넘긴다.

## Elevation & Depth

**그림자는 한 개도 없다.** `box-shadow` 선언이 스타일시트 전체에 0건이고, 그라디언트와 블러도 0건이다. 깊이는 전적으로 **색조 단차 세 단과 머리카락 선 하나**로 만든다.

지면 `{colors.bg}` → 올린 표면 `{colors.surface}`(설정 패널·모달) → 눌린 표면 `{colors.surface-2}`(버튼·스테퍼 트레이·비선택 칩). 패널은 1px `{colors.line}` 테두리를 두르고, 행과 행 사이도 같은 선 하나로 나눈다. 모달은 떠 있지만 그림자 대신 `::backdrop { background: rgba(5, 6, 8, 0.72) }`로 분리한다.

색이 든 실행 화면에서는 이 단차가 통하지 않으므로 규칙이 바뀐다: 보조 컨트롤은 지면 속으로 **검은색을 눌러 앉힌다**(`rgba(0,0,0,0.32)`, 누르면 0.46). 올리는 대신 파는 쪽이다. 탭으로 뜨는 컨트롤 판(`.dock`)도 같은 원리로 지면에 검정 45%를 섞은 불투명 색(`color-mix`)을 깐다 — 알파로 깔면 아래 숫자가 비친다. 가로 모드에서는 판을 한 줄로 눕힌다.

### Named Rules

**The No-Shadow Rule.** 이 세계에 그림자는 없다. 떠 보이게 하고 싶으면 표면 색을 한 단 올리고, 눌러 보이게 하고 싶으면 검은색 알파를 깐다. 새 레이어가 필요하면 먼저 기존 세 단으로 되는지 확인한다.

**The Hairline Is the Only Line Rule.** 구분선은 1px `{colors.line}` 하나뿐이다. 두께를 바꾸거나 두 번째 선 색을 만들지 않는다.

## Shapes

둥근 사각형 계열 하나로 통일한다. 반지름은 네 단뿐이다: 10px(스테퍼 버튼) · 12px(칩·프리셋) · 14px(`--radius`, 모든 버튼과 스테퍼 트레이) · 18px(`--radius-lg`, 패널과 모달). 작은 것이 더 둥글고 큰 것이 더 각진 역-비례가 아니라, **품는 쪽이 더 둥글다**.

알약(`border-radius: 999px`)은 스크롤바 썸에만 쓴다. 다음 단계 표시의 10px 점은 완전한 원이 아니라 반지름 3px 라운드 사각 — 원형 링과 구분되는 작은 사각 신호다.

유일한 원은 다이얼이다. SVG 200×200 뷰박스, 반지름 84, `stroke-width: 14`, `stroke-linecap: round`, `-90deg` 회전으로 12시에서 출발. 트랙은 `rgba(255,255,255,0.1)`, 진행은 단계 색. 선은 꽉 찬 원이 아니라 열린 호로, 둥근 끝이 남은 시간을 가리킨다.

아이콘은 −/+ 두 개뿐이고 글리프가 아니라 인라인 SVG 패스다(`stroke-width: 2.4`, `linecap: round`, currentColor). `<details>` 마커도 브라우저 기본 삼각형을 지우고 2px 보더 두 변으로 직접 그린다.

## Components

### Buttons

- **Shape:** 모든 버튼이 같은 둥근 사각(14px). 높이 56px(태블릿 60px), 좌우 18px, 테두리 없음.
- **Primary (accent):** 라임 바탕 + 근-검정 글자, 800. 설정 화면의 '시작'은 `btn--start`로 폭 100%, 높이 60px, 19px/900.
- **Primary (phase):** 실행 화면 주행동. 바탕이 `var(--phase)`라 단계가 바뀌면 함께 바뀐다. 컨트롤 바에서 `flex: 1.6`으로 보조 버튼보다 넓고, 480px 미만에서는 한 줄 전체.
- **Secondary / Ghost:** 설정·완료 화면에서는 눌린 표면(`{colors.surface-2}`), 실행 화면에서는 `rgba(0,0,0,0.32)` — 같은 버튼이 지면에 따라 배경만 갈아탄다.
- **Danger:** `{colors.danger}` 바탕 + 근-검정 글자. 리셋 확인 하나에만.
- **States:** hover 효과 없음(터치 우선). `:active`에서 `scale(0.97)` 120ms, `:disabled`에서 opacity 0.4. 포커스는 전역 3px 라임 링.

### Chips (신호음 시점)

- **Preset chips (끄기 · 마지막 3초 · 마지막 5초 · 10초 전부터):** 기본은 투명 바탕 + 1px 머리카락 선 + 흐린 회색 글자, 높이 46px, 12px 라운드. 선택되면 테두리를 지우고 라임 바탕 + 근-검정 글자. `auto-fit, minmax(120px, 1fr)` 그리드라 폭에 따라 2열↔4열로 접힌다.
- **Number chips (1~10):** 눌린 표면 바탕, 선택 시 라임. `repeat(5, 1fr)` 고정 5열 두 줄 — 폭에 따라 끝자리가 홀로 떨어지지 않게 한다. `:active`에서 `scale(0.94)`.
- **State:** 둘 다 `aria-pressed`를 단다. 프리셋과 칩은 같은 값을 양방향으로 반영하고, 프리셋에 없는 조합이면 '직접 고르기'가 펼쳐진 채로 열린다.

### Cards / Containers (설정 패널)

- **Corner Style:** 18px, `overflow: hidden`으로 첫·마지막 행의 모서리를 패널이 깎는다.
- **Background:** 올린 표면 + 1px 머리카락 테두리.
- **Shadow Strategy:** 없음 (Elevation & Depth 참조).
- **Internal Padding:** 행이 패딩을 갖는다(`10px 12px 10px 16px`, 최소 높이 64px). 행과 행 사이는 1px 선.
- **머리말:** 패널 밖 위쪽에 13px/700/+0.06em 흐린 회색으로 둔다. 패널 안으로 들이지 않는다.

### Inputs / Fields (숫자 스테퍼)

- **Style:** 행 오른쪽에 −/+ 버튼과 숫자 입력이 한 트레이(눌린 표면, 14px, 패딩 4px)로 묶인다. 버튼은 46×46 투명, 10px 라운드. 입력은 테두리·바탕 없이 22px/800 tabular, 오른쪽 정렬, 폭 52px, 뒤에 13px 단위(초/회).
- **Focus:** 전역 3px 라임 링. 커서(`caret-color`)도 라임.
- **Disabled:** 한계값에서 해당 방향 버튼만 `#474E59`로 죽는다. 네이티브 스피너는 숨긴다.
- **Hold:** 400ms 누르고 있으면 80ms 간격으로 반복 — 값이 커도 탭을 반복하지 않는다.

### Modal

- 네이티브 `<dialog>`. 올린 표면 + 머리카락 테두리 + 18px, 폭 22rem, 패딩 20px, 왼쪽 정렬 텍스트(화면 중 유일). 제목 19px/900, 본문 15px/500/lh 1.5 흐린 회색. 액션 두 개가 `flex: 1`로 폭을 나눠 갖고, 파괴적 행동이 오른쪽.
- 배경은 `rgba(5,6,8,0.72)`. 포커스 트랩·ESC·inert는 브라우저 기본 동작에 맡긴다.

### 다이얼 (시그니처 컴포넌트)

실행 화면의 전부. `--dial` 한 변수가 크기를 정하고, 그 안의 모든 활자가 그 변수에서 계산된다. 구성은 세 겹뿐이다 — 흰색 10% 트랙, 단계 색 진행 호, 그리고 절대 위치로 겹친 중앙 스택(단계명 + 남은 시간). 일시정지에서는 다이얼 전체가 `opacity: 0.68`로 내려앉고, 다음 단계 줄이 '일시정지'(단계 색, 18px/900/+0.1em)로 교체된다.

단계가 바뀔 때마다 React `key`로 다시 마운트돼 진입 모션이 정확히 한 번 돈다.

### Named Rules

**The Two Moments Rule.** 저작된 모션은 둘뿐이다. ① 다이얼 진입 `dial-in` — 420ms `cubic-bezier(0.16, 1, 0.3, 1)`, 단계마다 한 번. ② 마지막 3초 `tick` — 같은 길이·같은 이징으로 숫자가 beep과 같은 박자에 한 번 뛴다. 세 번째 모션을 추가하지 않는다. 그 외의 움직임은 버튼 `:active`의 120ms 스케일뿐이다.

**The Visible-First Rule.** 두 키프레임 모두 `from`만 갖는다 — 끝 상태가 기본값이라 애니메이션이 돌지 않아도 화면은 정상이다. `prefers-reduced-motion: reduce`에서 둘 다 `animation: none`, 버튼·칩 트랜지션도 `none`. 새 모션은 같은 조건을 만족해야 한다.

**The Hard Cut Rule.** 단계 지면 전환에는 트랜지션이 없다. 의도적이다 — 1~2m 거리에서 곁눈질로 볼 때 색이 서서히 녹으면 단계가 바뀐 시점을 놓친다. 지면은 잘라서 바꾼다.

## Do's and Don'ts

### Do:

- **Do** 실행 화면의 새 요소에 색을 줄 때 `var(--phase)`와 `var(--ground)`를 쓴다. 단계 색 네 개를 직접 쓰는 곳은 `:root`의 정의, `.screen[data-phase]`, 다음 단계 점 네 개뿐이다.
- **Do** 단계 색을 추가하거나 바꿀 때 9% 지면 값을 쌍으로 함께 만든다.
- **Do** 실행 화면의 활자를 `--dial` 비례로 쓴다(시간 ×0.245, 단계명 ×0.1).
- **Do** 숫자가 들어가는 모든 자리에 `font-variant-numeric: tabular-nums`를 단다.
- **Do** 단계를 알릴 때 색과 이름을 항상 함께 낸다.
- **Do** 터치 타겟을 버튼 56px / 소형 컨트롤 46px 이상으로 유지한다.
- **Do** 새 모션을 넣을 때 `from`만 있는 키프레임으로 쓰고 `prefers-reduced-motion` 블록에 추가한다.
- **Do** 한국어 텍스트에 `word-break: keep-all`을 유지하고, 버튼·칩은 `white-space: nowrap`으로 지킨다.
- **Do** 브라우저 표면(`::selection`, `caret-color`, 스크롤바, 포커스 링)을 팔레트 안에서 칠한다.
- **Do** `<dialog>`, `<details>`, `<fieldset>`, SVG처럼 브라우저가 이미 하는 일을 브라우저에게 맡긴다.

### Don't:

- **Don't** 그림자·그라디언트·블러·글라스를 들인다. 깊이는 표면 세 단과 1px 선으로 만든다.
- **Don't** 실행 화면에 라임(`{colors.accent}`)을 쓴다 — 포커스 링만 예외다.
- **Don't** 어떤 뷰포트에서도 2열로 분기한다. 넓어지면 다이얼과 여백을 키운다.
- **Don't** 단계 지면 전환에 트랜지션을 건다.
- **Don't** 숫자 전용 폰트나 다섯 번째 굵기를 추가한다. 가족은 하나, 굵기는 900/800/700/500.
- **Don't** 글리프 아이콘이나 아이콘 폰트를 들인다. 인라인 SVG 패스로 그린다.
- **Don't** 다섯 번째 반지름 값을 만든다(10 / 12 / 14 / 18 외).
- **Don't** 실행 화면에 고정 px 글자 크기를 새로 들인다.
- **Don't** 색이 든 지면 위에서 중성 회색(`{colors.fg-dim}` 원값)을 그대로 쓴다. 흰색 알파로 재정의한다.
- **Don't** 설정 화면 머리말을 패널 안으로 넣거나 패널에 두 번째 테두리 색을 준다.
