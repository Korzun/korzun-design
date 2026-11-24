import cx from 'classnames';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { depthClass, useSurfaceDepth } from '../../component/surface/index.js';
import { ChevronIcon, SpinnerIcon } from '../../icon/index.js';
import { Popover } from '../popover/index.js';
import { useStyle } from './style.js';

/** A `Select` option: a plain string (label and value alike), or `{ label, value, description? }`. */
export type SelectOption = string | { label: string; value: string; description?: string };

type InternalOption = { label: string; value: string; description?: string; _isCreate?: boolean };

export type SelectProps = {
  /** With a search query that matches no label exactly, offers an "Add: *query*" option. */
  allowCreate?: boolean;
  /** Show the inline "clear" (✕) control when a value is selected (default true). */
  clearable?: boolean;
  /** Faded; can't open; no clear button. */
  disabled?: boolean;
  /** Visible label; it targets the search box, not the closed trigger. */
  label?: string;
  /** Default `'horizontal'`; `horizontal`/`vertical` paint a card-header row. */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** Shows a spinner and "Loading…"; can't open. */
  loading?: boolean;
  /** Only lands on the search box while open: form data never carries the selection. */
  name: string;
  /** Receives the option's `value`, `undefined` from clear, or the trimmed typed text from "Add:"; not an event. */
  onChange?: (value: string | undefined) => void;
  /** Strings or `{ label, value, description? }` objects, mixed freely. */
  options: SelectOption[];
  /** Shown when nothing is selected. Default `'Select…'`. */
  placeholder?: string;
  /**
   * Which surface this select sits on, which decides its corner radius AND its
   * elevation together — they are one decision, not two.
   *
   * Unset, it follows where the select sits: `'page'` directly on a `Page`,
   * `'card'` in a card or dialog (and outside any surface), `'inset'` two or
   * more surfaces deep.
   *
   * `'card'` is the control as it has always looked: `radius.md`, no shadow,
   * because the card around it already provides both.
   *
   * `'page'` matches `theme.recipe.card.shell` — `radius.lg` plus
   * `shadow.cardStack` — so a select sitting directly on the page reads as its
   * own raised surface alongside the cards it shares that page with, instead of
   * a flat control missing the elevation everything around it has.
   *
   * `'inset'` takes `radius.sm` with no shadow, for a select nested inside an
   * inset box.
   *
   * Named for the surface rather than for `radius` (as `Button`'s own prop is),
   * because here the radius is a consequence, not the choice.
   */
  surface?: 'card' | 'page' | 'inset';
  /** Opening swaps the trigger for a search box (default `true`); `false` is a plain list, arrow keys only. */
  searchable?: boolean;
  /** Controlled selection; a value not in `options` displays as the raw string. */
  value: string | undefined;
};

function normalise(option: SelectOption): InternalOption {
  return typeof option === 'string' ? { label: option, value: option } : option;
}

function highlight(text: string, query: string, className: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className={className}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

const surfaceByDepth = ['page', 'card', 'inset'] as const;

/**
 * Controlled single-value picker with an optional search box and "Add:" entry,
 * its list in a `Popover`. No hidden input: submit `value` from state.
 */
export const Select = ({
  allowCreate = false,
  clearable = true,
  disabled = false,
  label,
  layout = 'horizontal',
  loading = false,
  name,
  onChange = () => {},
  options,
  placeholder = 'Select…',
  surface: surfaceProp,
  searchable = true,
  value,
}: SelectProps) => {
  const style = useStyle();
  // Depth 0 is a Page, 1 a card or dialog, 2 and deeper an inset box; outside any
  // surface it stays the card look. An explicit `surface` wins.
  const depth = useSurfaceDepth();
  const surface = surfaceProp ?? (depth === undefined ? 'card' : surfaceByDepth[depthClass(depth)]);
  // Per-instance DOM id so label/input association stays unique when two forms
  // sharing a `name` mount at once (e.g. the device create + edit forms).
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const triggerWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalisedOptions = useMemo(() => options.map(normalise), [options]);
  const filteredOptions = useMemo<InternalOption[]>(
    () => normalisedOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
    [normalisedOptions, query]
  );

  const createEntry = useMemo<InternalOption | null>(() => {
    if (!allowCreate || !query.trim()) return null;
    const trimmed = query.trim();
    const exactMatch = normalisedOptions.some(
      (o) => o.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (exactMatch) return null;
    return { label: trimmed, value: trimmed, _isCreate: true };
  }, [allowCreate, query, normalisedOptions]);

  const visibleOptions = useMemo<InternalOption[]>(
    () => (createEntry ? [...filteredOptions, createEntry] : filteredOptions),
    [filteredOptions, createEntry]
  );

  const selectedLabel = normalisedOptions.find((o) => o.value === value)?.label ?? value;

  const open = useCallback(() => {
    if (disabled || loading) return;
    setIsOpen(true);
    setHighlightedIndex(0);
  }, [disabled, loading]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setHighlightedIndex(0);
  }, []);

  const select = useCallback(
    (optValue: string) => {
      onChange(optValue);
      close();
    },
    [onChange, close]
  );

  const clear = useCallback(() => {
    onChange(undefined);
  }, [onChange]);

  useEffect(() => {
    if (isOpen && searchable) {
      inputRef.current?.focus();
    }
  }, [isOpen, searchable]);

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    },
    [open]
  );

  const handleOpenTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((i) =>
          visibleOptions.length === 0 ? 0 : (i + 1) % visibleOptions.length
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((i) =>
          visibleOptions.length === 0 ? 0 : (i - 1 + visibleOptions.length) % visibleOptions.length
        );
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const opt = visibleOptions[highlightedIndex];
        if (opt) select(opt.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab') {
        close();
      }
    },
    [visibleOptions, highlightedIndex, select, close]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((i) =>
          visibleOptions.length === 0 ? 0 : (i + 1) % visibleOptions.length
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((i) =>
          visibleOptions.length === 0 ? 0 : (i - 1 + visibleOptions.length) % visibleOptions.length
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const opt = visibleOptions[highlightedIndex];
        if (opt) select(opt.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab') {
        close();
      }
    },
    [visibleOptions, highlightedIndex, select, close]
  );

  return (
    <div className={cx(style.root, style[layout], style[surface])}>
      {label && (
        <label className={style.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div ref={triggerWrapperRef} className={style.triggerWrapper}>
        {isOpen && searchable ? (
          <div className={cx(style.trigger, style[surface])}>
            <input
              ref={inputRef}
              id={inputId}
              name={name}
              autoComplete="off"
              className={style.searchInput}
              aria-label="Search"
              placeholder="Type to search…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
            />
            <span
              className={cx(style.chevron, style.open)}
              role="button"
              tabIndex={-1}
              aria-label="Close"
              onMouseDown={(e) => e.preventDefault()}
              onClick={close}
            >
              <ChevronIcon height={12} width={12} />
            </span>
          </div>
        ) : (
          <div
            className={cx(style.trigger, style[surface], {
              [style.loading]: loading,
              [style.disabled]: disabled,
              [style.open]: isOpen,
            })}
            role="button"
            tabIndex={disabled || loading ? -1 : 0}
            aria-label={selectedLabel ?? placeholder}
            onClick={isOpen ? close : open}
            onKeyDown={isOpen ? handleOpenTriggerKeyDown : handleTriggerKeyDown}
          >
            {loading && <SpinnerIcon className={style.spinner} />}
            <span className={cx(style.triggerText, { [style.placeholder]: !selectedLabel })}>
              {loading ? 'Loading…' : (selectedLabel ?? placeholder)}
            </span>
            {value && clearable && !disabled && !loading && (
              <span
                className={style.clearButton}
                role="button"
                tabIndex={0}
                aria-label="Clear"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    clear();
                  }
                }}
              >
                ✕
              </span>
            )}
            <span className={style.chevron}>
              <ChevronIcon height={12} width={12} />
            </span>
          </div>
        )}
        <Popover anchorRef={triggerWrapperRef} open={isOpen} onClose={close}>
          <div className={style.dropdown}>
            <ul className={style.optionList} role="listbox">
              {visibleOptions.length === 0 ? (
                <li
                  className={cx(style.option, style.emptyOption)}
                  role="option"
                  aria-selected={false}
                >
                  No results
                </li>
              ) : (
                visibleOptions.map((opt, index) => (
                  <li
                    key={opt._isCreate ? `__create__${opt.value}` : opt.value}
                    className={cx(style.option, {
                      [style.highlighted]: index === highlightedIndex,
                      [style.selected]: !opt._isCreate && opt.value === value,
                      [style.createOption]: opt._isCreate,
                    })}
                    role="option"
                    aria-selected={!opt._isCreate && opt.value === value}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(opt.value)}
                  >
                    {opt._isCreate ? (
                      <>
                        Add: <strong>{opt.label}</strong>
                      </>
                    ) : (
                      <>
                        <div>{highlight(opt.label, query, style.matchHighlight)}</div>
                        {opt.description && (
                          <div className={style.optionDescription}>{opt.description}</div>
                        )}
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </Popover>
      </div>
    </div>
  );
};
