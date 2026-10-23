---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/index.css","src/components","src/main.tsx"]
---

Scope: 운동 타이머 앱 전체 표면 — 설정 화면, 실행 화면(running/paused), 완료 화면. 모바일·태블릿 우선, 가로/세로 양쪽.

Visitor mode: Operate. 사용자는 운동 중 조작하지 않고 읽기만 한다. 작업 = 설정 7개를 맞추고 시작, 그 뒤로는 단계·남은 시간·다음 단계를 1~2m 거리에서 읽는 것.

Audience/job/constraints: 혼자 집에서 타바타·HIIT 하는 사람. 기기는 바닥·매트 옆 1~2m. 숨찬 상태, 곁눈질, 손은 바쁨. 기술 제약은 PRODUCT.md(React 18/Vite/TS, 외부 UI 라이브러리 없음, Web Audio, localStorage).

Chosen direction: 카테고리 표준(canon)을 사용자가 의도적으로 선택. 품질 바는 Tabata/HIIT 전용 타이머 앱 + Apple 피트니스 수준의 정밀함. 비꼼 없이, 기이한 변주 없이 정공법.

사용자 지정 제약(세션 중 직접 지시): ① 활자는 Pretendard. ② 가로 모드 실행 화면은 1열 유지(2열 분기 금지), 다이얼 크기로만 대응. ③ 설정 화면은 1열 유지. ④ 신호음 설정은 직관적으로.

## Direction contract

THESIS: 인터벌 타이머가 실제로 출시되는 형태 — 어두운 바탕, 단계 색이 지배하는 원형 진행 링, 거대한 남은 시간 — 를 동종 앱보다 정확하고 조용하게 친다. 거부하는 배치: 세계관 코스튬(사인 패널·기보·스펙시멘), 장식적 그라디언트·글라스, 카드 격자.

OWN-WORLD: 근-검정 지면(#0A0B0D)과 한 단 올린 표면(#14161A), 머리카락 선(#262A32). 단계가 색을 지배한다: 준비 앰버 #FFC53D, 운동 코랄레드 #FF5A3C, 휴식 민트 #2FD49B, 세트 휴식 블루 #5B8DEF. 실행 화면 지면은 그 단계 색을 9% 섞은 값(#201D11 / #201211 / #0D1D1A / #111721)이라 링이 바탕에서 떨어져 나온다. 앱 정체성 색은 라임 #CCFF4D로 설정·완료 화면의 주행동과 선택 상태에만. 활자는 Pretendard Variable 한 가족, 900/800/700/500 네 단, 숫자는 tabular-nums. 컨트롤은 반지름 14px 라운드 사각, 작은 토글만 알약. 실행 화면은 성기고 크게, 설정 화면은 섹션 목록으로 조밀하게.

STORY: 사용자는 설정 화면에서 7개 값을 몇 번의 탭으로 맞추고 — 신호음은 프리셋(끄기·마지막 3초·마지막 5초·10초 전부터) 한 번으로 끝나고 필요하면 '직접 고르기'를 펼친다 — 총 시간을 확인한 뒤 시작한다. 운동 중에는 색과 숫자만으로 "지금 무엇을, 몇 초, 다음은 무엇"을 읽는다. 끝나면 총 시간을 보고 다시 시작하거나 설정으로 돌아간다.

FIRST VIEWPORT(실행 화면, 390×844): 상단 한 줄에 세트 1/3 · 사이클 2/8 · 종료까지 13:02. 중앙에 `min(78vw, 50dvh, 420px)` 진행 링(가로 낮은 화면은 `min(42vw, 62dvh)`, 태블릿은 `min(78vw, 58dvh, 560px)`), 링 색은 현재 단계 색, 링 안에 단계명(단계 색)과 남은 시간(거대, 흰색, tabular). 링 아래 다음 단계 한 줄. 하단에 주행동(일시정지, 단계 색)과 보조 3개 — 480px 미만에서는 주행동이 한 줄을 통째로 차지한다. 주행동은 항상 엄지 영역 안.

FORM: 카테고리 표준(canon), 사용자가 standing exit로 선택. 내 순위 목록에는 없던 선택지(월드 후보 7개는 복싱·트랙·수영계시판·환승안내·체육대회·태권도·등산표지였다). seed:1b30fdee8f21d230

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Unresolved: Pretendard를 jsDelivr CDN(dynamic subset)으로 싣는다. self-host 전환은 미결 — 한글 전체 서브셋을 직접 호스팅하는 비용 대비 이득을 아직 재지 않았다.
