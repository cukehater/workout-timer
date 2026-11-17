# Vercel 배포 전환

## 의도
GitHub Pages 배포(Actions 워크플로, `/workout-timer/` 하위 경로)를 걷어내고 Vercel로 배포한다.

## 결정
- 방식: Vercel Git 연동. `main` push 시 production 자동 배포, PR마다 프리뷰.
- 테스트 CI: 두지 않는다. 워크플로를 통째로 지우고 테스트는 로컬에서만 돌린다.
- 주소: 첫 배포로 받은 vercel.app 도메인을 `index.html`의 canonical, og:url, og:image, twitter:image에 쓴다.

## 접근
- 고른 것: Git 연동, `vercel.json` 없음. Vercel이 Vite를 자동 감지한다.
- 고르지 않은 것: CLI 수동 배포(매번 직접 실행해야 함), Vercel 빌드 명령에 테스트 포함(테스트 CI를 두지 않기로 함), 테스트 전용 워크플로 유지(같은 이유).

## 변경
- `.github/workflows/deploy.yml` 삭제
- `vite.config.ts`의 `base` 삭제(루트 서비스)
- `index.html` 절대 URL 교체
- `PRODUCT.md`, 최초 설계 문서의 배포 절 갱신
- GitHub 저장소의 Pages 설정 해제
