import { storyById, type StoryEntry } from '@gallery/stories';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { useThemeSetting } from '../../src/theme/index.js';
import { isThemeValue, parseArgsParam, restoreClearedArgs, type ThemeValue } from '../messages.js';
import { StoryNotFound } from '../not-found.js';
import { ActionsLog, type ActionRecord } from './actions-log.js';
import { Canvas } from './canvas.js';
import { PropsPanel } from './props-panel.js';
import { Toolbar, WIDTHS, type WidthPreset } from './toolbar.js';

const useStyle = createUseStyles((theme: Theme) => ({
  view: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%' },
  body: { display: 'flex', flex: 1, minHeight: 0 },
  side: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    flexShrink: 0,
    overflowY: 'auto',
    borderLeft: `1px solid ${theme.color.border.default}`,
    boxSizing: 'border-box',
  },
}));

const isWidthPreset = (value: string | null): value is WidthPreset =>
  WIDTHS.some((w) => w.value === value);

const StoryViewBody = ({ entry }: { entry: StoryEntry }): ReactElement => {
  const styles = useStyle();
  const [params, setParams] = useSearchParams();
  const [setting, setSetting] = useThemeSetting();
  const [records, setRecords] = useState<ActionRecord[]>([]);

  // A deep link's ?theme= wins once, on mount; after that the setting leads.
  const [deepLinkTheme] = useState(() => {
    const fromUrl = params.get('theme');
    return isThemeValue(fromUrl) ? fromUrl : null;
  });
  useEffect(() => {
    if (deepLinkTheme && deepLinkTheme !== setting) setSetting(deepLinkTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme: ThemeValue = setting;
  const widthParam = params.get('width');
  const width: WidthPreset = isWidthPreset(widthParam) ? widthParam : 'fill';
  const rawArgs = params.get('args');
  const overrides = useMemo(() => parseArgsParam(rawArgs), [rawArgs]);

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const onTheme = (t: ThemeValue) => {
    setSetting(t);
    update('theme', t);
  };

  const onChange = (name: string, value: unknown) => {
    // A cleared control is kept as null so the default does not snap back.
    const merged = { ...overrides, [name]: value === undefined ? null : value };
    update('args', Object.keys(merged).length === 0 ? null : JSON.stringify(merged));
  };

  const onAction = (name: string, args: unknown[]) =>
    setRecords((prev) => [...prev, { at: new Date().toLocaleTimeString(), name, args }]);

  return (
    <div className={styles.view}>
      <Toolbar
        entry={entry}
        theme={theme}
        onTheme={onTheme}
        width={width}
        onWidth={(w) => update('width', w)}
      />
      <div className={styles.body}>
        <Canvas
          entry={entry}
          theme={theme}
          initialTheme={deepLinkTheme ?? theme}
          width={width}
          overrides={overrides}
          onAction={onAction}
        />
        <div className={styles.side}>
          <PropsPanel
            entry={entry}
            values={{ ...entry.args, ...restoreClearedArgs(overrides) }}
            onChange={onChange}
          />
          <ActionsLog records={records} onClear={() => setRecords([])} />
        </div>
      </div>
    </div>
  );
};

export const StoryView = (): ReactElement => {
  const id = useParams()['*'] ?? '';
  const entry = storyById(id);
  if (!entry) return <StoryNotFound id={id} />;
  return <StoryViewBody key={entry.id} entry={entry} />;
};
