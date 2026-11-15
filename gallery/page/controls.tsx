import {
  BackButton,
  Button,
  ChipsInput,
  ConfirmModal,
  DateTimeInput,
  FieldList,
  NumberInput,
  PageActionsBar,
  PageActionsMenu,
  PageFooterActions,
  Popover,
  SegmentedControl,
  Select,
  Switch,
  TextArea,
  TextInput,
  type FieldRow,
  type PageActionItem,
} from '@korzun/design/control';
import { SearchIcon, SettingsIcon } from '@korzun/design/icon';
import { createUseStyles, type Theme } from '@korzun/design/theme';
import { useToast } from '@korzun/design/toast';
import { useRef, useState, type ReactNode } from 'react';

const useStyle = createUseStyles((theme: Theme) => ({
  section: { display: 'flex', flexDirection: 'column', gap: theme.space.xl, marginBottom: '2rem' },
  heading: { margin: 0, fontSize: theme.fontSize.xl },
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: theme.space.xl },
  stack: { display: 'flex', flexDirection: 'column', gap: theme.space.xl, maxWidth: 480 },
  popover: {
    padding: theme.space.xl,
    backgroundColor: theme.color.bg.card,
    border: `1px solid ${theme.color.border.default}`,
    borderRadius: theme.radius.md,
  },
}));

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  const styles = useStyle();
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      {children}
    </section>
  );
};

const SEGMENTS = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
] as const;

const ICON_SEGMENTS = [
  { value: 'search', label: 'Search', Icon: SearchIcon },
  { value: 'settings', label: 'Settings', Icon: SettingsIcon },
] as const;

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date'];

export function ControlsPage() {
  const styles = useStyle();
  const toast = useToast();
  const noop = () => {};

  const [text, setText] = useState<string | undefined>('Hello');
  const [area, setArea] = useState<string | undefined>('Some longer text');
  const [num, setNum] = useState<number | undefined>(42);
  const [date, setDate] = useState<string | undefined>(undefined);
  const [select, setSelect] = useState<string | undefined>('Banana');
  const [chips, setChips] = useState<string[]>(['Apple']);
  const [segment, setSegment] = useState<'one' | 'two' | 'three'>('one');
  const [iconSegment, setIconSegment] = useState<string | null>('search');
  const [on, setOn] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverAnchor = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<FieldRow[]>([
    { _key: 'a', name: 'Alpha', qty: 1 },
    { _key: 'b', name: 'Beta', qty: 2 },
  ]);

  const actionItems: PageActionItem[] = [
    { label: 'Edit', onClick: () => toast('Edit', 'info'), primary: true },
    { label: 'Share', onClick: () => toast('Share', 'info'), primary: true, align: 'leading' },
    { label: 'Duplicate', onClick: () => toast('Duplicate', 'info') },
    { label: 'Archive', onClick: noop, disabled: true },
    {
      label: 'Delete',
      onClick: () => toast('Delete', 'error'),
      danger: true,
      separatorBefore: true,
    },
  ];

  return (
    <div>
      <h1>Controls</h1>

      <Section title="Button">
        <div className={styles.row}>
          <Button onClick={() => toast('Hello from the gallery', 'success')}>Fire toast</Button>
          <Button type="primary">Primary</Button>
          <Button type="text">Text</Button>
          <Button type="link">Link</Button>
          <Button type="dashed">Dashed</Button>
        </div>
        <div className={styles.row}>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button type="primary" disabled>
            Primary disabled
          </Button>
          <Button type="primary" loading>
            Primary loading
          </Button>
          <Button danger>Danger</Button>
          <Button type="primary" danger>
            Danger primary
          </Button>
          <Button success>Success</Button>
          <Button prefix={SearchIcon} suffix={SettingsIcon}>
            With icons
          </Button>
        </div>
      </Section>

      <Section title="TextInput">
        <div className={styles.stack}>
          <TextInput name="text" label="Default" value={text} onChange={setText} />
          <TextInput
            name="text-invalid"
            label="Validated (must not be empty)"
            value={text}
            onChange={setText}
            validate={(v) => v.length > 0}
            layout="vertical"
          />
          <TextInput name="pw" label="Password" password value="secret" layout="vertical" />
          <TextInput name="ph" label="Placeholder" placeholder="Type here" value="" />
        </div>
      </Section>

      <Section title="TextArea">
        <div className={styles.stack}>
          <TextArea name="area" label="Default" value={area} onChange={setArea} layout="vertical" />
          <TextArea
            name="area-auto"
            label="Auto-resize, max 80"
            value={area}
            onChange={setArea}
            autoResize
            maxLength={80}
            layout="vertical"
          />
          <TextArea name="area-b" label="Borderless" value="" variant="borderless" />
        </div>
      </Section>

      <Section title="NumberInput">
        <div className={styles.stack}>
          <NumberInput name="num" label="Number" value={num} onChange={setNum} />
          <NumberInput
            name="num-v"
            label="Vertical"
            value={num}
            onChange={setNum}
            layout="vertical"
          />
        </div>
      </Section>

      <Section title="DateTimeInput">
        <div className={styles.stack}>
          <DateTimeInput name="date" label="When" value={date} onChange={setDate} />
          <div>{date ?? '(empty)'}</div>
        </div>
      </Section>

      <Section title="Select">
        <div className={styles.stack}>
          <Select name="sel" label="Default" options={FRUITS} value={select} onChange={setSelect} />
          <Select
            name="sel-create"
            label="Allow create"
            options={FRUITS}
            value={select}
            onChange={setSelect}
            allowCreate
            layout="vertical"
          />
          <Select name="sel-dis" label="Disabled" options={FRUITS} value="Apple" disabled />
          <Select name="sel-load" label="Loading" options={FRUITS} value={undefined} loading />
        </div>
      </Section>

      <Section title="ChipsInput">
        <div className={styles.stack}>
          <ChipsInput
            label="Fruits"
            value={chips}
            suggestions={FRUITS}
            onChange={setChips}
            placeholder="Add fruit"
          />
          <ChipsInput
            label="Disabled"
            value={['Cherry']}
            suggestions={FRUITS}
            onChange={noop}
            disabled
            chipColor="author"
          />
        </div>
      </Section>

      <Section title="SegmentedControl">
        <div className={styles.stack}>
          <SegmentedControl label="Text" options={SEGMENTS} value={segment} onChange={setSegment} />
          <SegmentedControl
            label="Icons, clearable"
            options={ICON_SEGMENTS}
            value={iconSegment}
            onChange={setIconSegment}
            clearable
            showLabels={false}
          />
          <SegmentedControl label="Read-only" options={SEGMENTS} value="two" />
        </div>
      </Section>

      <Section title="Switch">
        <div className={styles.stack}>
          <Switch name="sw" label="Default" checked={on} onChange={setOn} />
          <Switch
            name="sw-desc"
            label="With description"
            description="Helper text"
            checked={on}
            onChange={setOn}
          />
          <Switch name="sw-dis" label="Disabled" checked disabled onChange={noop} />
          <Switch name="sw-load" label="Loading" checked={false} loading onChange={noop} />
        </div>
      </Section>

      <Section title="FieldList">
        <div className={styles.stack}>
          <FieldList
            addLabel="Add row"
            columns={[
              { type: 'text', key: 'name', placeholder: 'Name' },
              { type: 'number', key: 'qty', placeholder: 'Qty' },
            ]}
            rows={rows}
            onAdd={() => setRows((r) => [...r, { _key: String(Date.now()) }])}
            onChange={(rowKey, field, value) =>
              setRows((r) =>
                r.map((row) => (row._key === rowKey ? { ...row, [field]: value } : row))
              )
            }
            onRemove={(rowKey) => setRows((r) => r.filter((row) => row._key !== rowKey))}
          />
        </div>
      </Section>

      <Section title="ConfirmModal (uses useModalDialog)">
        <div className={styles.row}>
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button danger onClick={() => setDangerModalOpen(true)}>
            Open danger modal
          </Button>
        </div>
        <ConfirmModal
          isOpen={modalOpen}
          title="Confirm action"
          onCancel={() => setModalOpen(false)}
          onConfirm={() => setModalOpen(false)}
        >
          Are you sure?
        </ConfirmModal>
        <ConfirmModal
          isOpen={dangerModalOpen}
          title="Delete everything"
          icon={SettingsIcon}
          danger
          confirmText="Delete"
          onCancel={() => setDangerModalOpen(false)}
          onConfirm={() => setDangerModalOpen(false)}
        >
          This cannot be undone.
        </ConfirmModal>
      </Section>

      <Section title="Popover">
        <div className={styles.row}>
          <div ref={popoverAnchor} style={{ display: 'inline-block' }}>
            <Button onClick={() => setPopoverOpen((o) => !o)}>Toggle popover</Button>
          </div>
        </div>
        <Popover
          anchorRef={popoverAnchor}
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          matchWidth={false}
        >
          <div className={styles.popover}>Popover content</div>
        </Popover>
      </Section>

      <Section title="BackButton">
        <div className={styles.row}>
          <BackButton to="/controls" />
        </div>
      </Section>

      <Section title="PageActionsBar">
        <PageActionsBar items={actionItems} />
      </Section>

      <Section title="PageActionsMenu">
        <div className={styles.row}>
          <PageActionsMenu items={actionItems} />
        </div>
      </Section>

      <Section title="PageFooterActions">
        <PageFooterActions
          items={[
            { label: 'Delete', onClick: noop, danger: true, align: 'leading' },
            { label: 'Cancel', onClick: noop },
            { label: 'Busy', onClick: noop, loading: true },
            { label: 'Disabled', onClick: noop, disabled: true },
            { label: 'Save', onClick: noop, emphasis: true },
          ]}
        />
      </Section>
    </div>
  );
}
