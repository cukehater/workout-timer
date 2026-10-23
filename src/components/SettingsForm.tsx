import { buildPhases, totalSeconds } from '../lib/buildPhases';
import type { TimerConfig } from '../lib/config';
import { formatMMSS } from '../lib/format';
import { BeepSelector } from './BeepSelector';
import { NumberStepper } from './NumberStepper';

type Props = {
  config: TimerConfig;
  onChange: (config: TimerConfig) => void;
  onStart: () => void;
};

export function SettingsForm({ config, onChange, onStart }: Props) {
  const phases = buildPhases(config);
  const set = <K extends keyof TimerConfig>(key: K, value: TimerConfig[K]) =>
    onChange({ ...config, [key]: value });

  return (
    <div className="setup">
      <h1 className="setup__title">운동 타이머</h1>

      <section className="panel">
        <h2 className="panel__label">시간</h2>
        <div className="panel__rows">
          <NumberStepper
            field="prepSec"
            value={config.prepSec}
            isTime
            onChange={(v) => set('prepSec', v)}
          />
          <NumberStepper
            field="workSec"
            value={config.workSec}
            isTime
            onChange={(v) => set('workSec', v)}
          />
          <NumberStepper
            field="restSec"
            value={config.restSec}
            isTime
            onChange={(v) => set('restSec', v)}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="panel__label">반복</h2>
        <div className="panel__rows">
          <NumberStepper field="sets" value={config.sets} onChange={(v) => set('sets', v)} />
          <NumberStepper field="cycles" value={config.cycles} onChange={(v) => set('cycles', v)} />
          <NumberStepper
            field="setRestSec"
            value={config.setRestSec}
            isTime
            onChange={(v) => set('setRestSec', v)}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="panel__label">알림</h2>
        <div className="panel__rows">
          <BeepSelector value={config.beepAt} onChange={(v) => set('beepAt', v)} />
        </div>
      </section>

      <div className="setup__footer">
        <p className="setup__summary">
          <span>단계 {phases.length}개</span>
          <b>총 {formatMMSS(totalSeconds(phases))}</b>
        </p>
        <button type="button" className="btn btn--accent btn--start" onClick={onStart}>
          시작
        </button>
      </div>
    </div>
  );
}
