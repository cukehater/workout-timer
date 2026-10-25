import { useEffect, useState } from 'react';
import { Controls } from './components/Controls';
import { Modal } from './components/Modal';
import { NextUp } from './components/NextUp';
import { ProgressInfo } from './components/ProgressInfo';
import { SettingsForm } from './components/SettingsForm';
import { TimerDisplay } from './components/TimerDisplay';
import { useStoredSettings } from './hooks/useStoredSettings';
import { useTimer } from './hooks/useTimer';
import { useWakeLock } from './hooks/useWakeLock';
import { totalSeconds } from './lib/buildPhases';
import { formatMMSS } from './lib/format';

/** 탭으로 띄운 컨트롤이 진행 중에 저절로 사라지기까지 */
const CONTROLS_HIDE_MS = 4000;

export default function App() {
  const { config, setConfig } = useStoredSettings();
  const { state, start, pause, resume, skip, prev, reset } = useTimer(config);
  const wakeLockSupported = useWakeLock(state.status === 'running');
  const [confirmReset, setConfirmReset] = useState(false);
  const [controlsShown, setControlsShown] = useState(false);

  const running = state.status === 'running' || state.status === 'paused';
  const phaseType = running ? state.phases[state.index].type : state.status;

  // 폰 브라우저의 상단 바도 단계 색을 따라간다
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const screen = document.querySelector('.screen');
    const ground = screen && getComputedStyle(screen).backgroundColor;
    if (ground) meta.setAttribute('content', ground);
  }, [phaseType]);

  // 스페이스바로 일시정지/재개
  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (state.status === 'running') pause();
      else resume();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, state.status, pause, resume]);

  // 버튼으로 단계·상태가 바뀌면 숨김 타이머를 다시 잰다
  useEffect(() => {
    if (!controlsShown || state.status !== 'running') return;
    const id = setTimeout(() => setControlsShown(false), CONTROLS_HIDE_MS);
    return () => clearTimeout(id);
  }, [controlsShown, state.status, state.index]);

  if (state.status === 'idle') {
    return (
      <main className="screen" data-phase="idle">
        <SettingsForm config={config} onChange={setConfig} onStart={start} />
      </main>
    );
  }

  if (state.status === 'finished') {
    const total = formatMMSS(totalSeconds(state.phases));
    return (
      <main className="screen screen--center" data-phase="done">
        <div className="done">
          <h1 className="done__title">운동 완료</h1>
          {/* 글자 수를 넘겨 CSS가 폭에 맞춰 크기를 정한다 */}
          <p className="done__total" style={{ '--chars': total.length } as React.CSSProperties}>
            {total}
          </p>
          <p className="done__detail">
            총 운동 시간 · {config.sets}세트 × {config.cycles}사이클
          </p>
          <div className="done__actions">
            <button type="button" className="btn btn--accent" onClick={start}>
              다시 시작
            </button>
            <button type="button" className="btn" onClick={reset}>
              설정으로
            </button>
          </div>
        </div>
      </main>
    );
  }

  const phase = state.phases[state.index];

  return (
    <main
      className="screen screen--run"
      data-phase={phase.type}
      data-paused={state.status === 'paused' ? '' : undefined}
      onClick={(e) => {
        // 숨은 컨트롤은 클릭을 받지 않으므로 첫 탭은 컨트롤을 띄우기만 한다
        if ((e.target as Element).closest('.controls, .modal')) return;
        setControlsShown((shown) => !shown);
      }}
      onFocus={() => setControlsShown(true)}
    >
      <ProgressInfo
        phases={state.phases}
        index={state.index}
        remainingMs={state.remainingMs}
        sets={config.sets}
        cycles={config.cycles}
      />

      {/* 단계가 바뀔 때마다 다시 마운트해 진입 모션을 한 번 돌린다 */}
      <TimerDisplay
        key={state.index}
        phase={phase}
        remainingMs={state.remainingMs}
        running={state.status === 'running'}
      />

      <NextUp next={state.phases[state.index + 1]} />

      {/* 일시정지 중에는 늘 보인다 — 재개할 곳을 찾게 만들지 않는다 */}
      <div
        className="dock"
        data-shown={controlsShown || state.status === 'paused' ? '' : undefined}
      >
        {/* 일시정지 중엔 컨트롤 판이 화면 아래를 덮으므로 표시도 판 위에 둔다 */}
        {state.status === 'paused' && <p className="next next--paused">일시정지</p>}
        <Controls
          status={state.status}
          canPrev={state.index > 0}
          onPause={pause}
          onResume={resume}
          onPrev={prev}
          onSkip={skip}
          onResetRequest={() => setConfirmReset(true)}
        />

        <p className="note">
          {wakeLockSupported
            ? '다른 탭으로 이동하면 알림이 늦을 수 있습니다.'
            : '이 브라우저는 화면 꺼짐 방지를 지원하지 않습니다. 화면이 꺼지면 알림이 늦을 수 있습니다.'}
        </p>
      </div>

      <Modal
        open={confirmReset}
        title="운동을 리셋할까요?"
        confirmLabel="리셋"
        onConfirm={() => {
          setConfirmReset(false);
          reset();
        }}
        onCancel={() => setConfirmReset(false)}
      >
        진행 중인 세트와 사이클이 모두 초기화됩니다.
      </Modal>
    </main>
  );
}
