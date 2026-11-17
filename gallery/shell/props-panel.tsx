import type { StoryEntry } from '@gallery/stories';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import type { ReactElement } from 'react';

import { NumberInput } from '../../src/control/number-input/index.js';
import { Select } from '../../src/control/select/index.js';
import { Switch } from '../../src/control/switch/index.js';
import { TextInput } from '../../src/control/text-input/index.js';
import type { ArgType } from '../story.js';

const useStyle = createUseStyles((theme: Theme) => ({
  panel: { display: 'flex', flexDirection: 'column', gap: theme.space.md, padding: theme.space.xl },
  heading: { margin: 0, fontSize: 'inherit', fontWeight: theme.fontWeight.bold },
  row: { display: 'flex', flexDirection: 'column', gap: theme.space.sm },
  name: { color: theme.color.text.secondary },
  empty: { color: theme.color.text.secondary, margin: 0 },
}));

type PropsPanelProps = {
  entry: StoryEntry;
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
};

const clamp = (value: number | undefined, argType: { min?: number; max?: number }) => {
  if (value === undefined) return value;
  const { min, max } = argType;
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
};

export const PropsPanel = ({ entry, values, onChange }: PropsPanelProps): ReactElement => {
  const styles = useStyle();
  const rows = Object.entries(entry.argTypes).filter(
    (row): row is [string, Exclude<ArgType, { control: 'action' }>] => row[1].control !== 'action'
  );

  const renderControl = (name: string, argType: Exclude<ArgType, { control: 'action' }>) => {
    const value = values[name];
    switch (argType.control) {
      case 'boolean':
        // Switch names itself from `ariaLabel`; no outer label needed.
        return (
          <Switch
            name={name}
            ariaLabel={name}
            layout="default"
            checked={value === true}
            onChange={(v) => onChange(name, v)}
          />
        );
      case 'text':
        return (
          <TextInput
            name={name}
            layout="inline"
            value={typeof value === 'string' ? value : undefined}
            onChange={(v) => onChange(name, v ?? '')}
          />
        );
      case 'number':
        return (
          <NumberInput
            name={name}
            label={undefined}
            layout="inline"
            value={typeof value === 'number' ? value : undefined}
            onChange={(v) => onChange(name, clamp(v, argType))}
          />
        );
      case 'select':
        return (
          <Select
            name={name}
            layout="inline"
            clearable={false}
            options={[...argType.options]}
            value={typeof value === 'string' ? value : undefined}
            onChange={(v) => onChange(name, v)}
          />
        );
    }
  };

  return (
    <section aria-label="Props" className={styles.panel}>
      <h2 className={styles.heading}>Props</h2>
      {rows.length === 0 && (
        <p className={styles.empty}>This story declares no adjustable props.</p>
      )}
      {rows.map(([name, argType]) =>
        argType.control === 'boolean' ? (
          <div key={name} className={styles.row}>
            {renderControl(name, argType)}
          </div>
        ) : argType.control === 'select' ? (
          // Closed, Select renders no labelable element, so the group names it.
          <div key={name} role="group" aria-label={name} className={styles.row}>
            <span className={styles.name}>{name}</span>
            {renderControl(name, argType)}
          </div>
        ) : (
          // The controls do not tie their label to the input (no htmlFor), so
          // this outer label names it.
          <label key={name} className={styles.row}>
            <span className={styles.name}>{name}</span>
            {renderControl(name, argType)}
          </label>
        )
      )}
    </section>
  );
};
