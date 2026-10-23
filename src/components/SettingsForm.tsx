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
    <div className="settings">
      <h1 className="settings__title">운동 타이머</h1>

      <div className="settings__fields">
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
        <NumberStepper field="sets" value={config.sets} onChange={(v) => set('sets', v)} />
        <NumberStepper field="cycles" value={config.cycles} onChange={(v) => set('cycles', v)} />
        <NumberStepper
          field="setRestSec"
          value={config.setRestSec}
          isTime
          onChange={(v) => set('setRestSec', v)}
        />
      </div>

      <BeepSelector value={config.beepAt} onChange={(v) => set('beepAt', v)} />

      <div className="settings__footer">
        <p className="settings__summary">
          단계 {phases.length}개 · 총 {formatMMSS(totalSeconds(phases))}
        </p>
        <button type="button" className="btn btn--primary btn--start" onClick={onStart}>
          시작
        </button>
      </div>
    </div>
  );
}
