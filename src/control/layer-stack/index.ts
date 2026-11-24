import { type RefObject, useLayoutEffect, useRef } from 'react';

/**
 * One open floating layer (a popover, a menu, a modal dialog). Layers stack in
 * registration order; Escape and outside pointer-down go to the innermost
 * (most recently opened) layer first.
 */
export interface Layer {
  /** Omit for a pass-through layer (a native dialog): the stack neither handles nor preventDefaults Escape. */
  onEscape?: () => void;
  /** Whether a pointer-down on `node` is inside this layer. Omit = never inside. */
  contains?: (node: Node) => boolean;
  /** Called when a pointer-down lands outside this layer and every layer above it. */
  onOutsidePointerDown?: () => void;
}

// Bottom first. Entries are each layer's ref, so new callbacks never reorder it.
const stack: RefObject<Layer>[] = [];

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || event.defaultPrevented) return;
  const top = stack[stack.length - 1]?.current;
  if (!top?.onEscape) return;
  // preventDefault on keydown is what stops a native <dialog> from cancelling.
  event.preventDefault();
  top.onEscape();
};

const handleMouseDown = (event: MouseEvent) => {
  const target = event.target as Node;
  // A snapshot: a callback may close its layer and so remove it mid-walk.
  for (const entry of [...stack].reverse()) {
    const layer = entry.current;
    if (layer.contains?.(target)) return;
    layer.onOutsidePointerDown?.();
  }
};

/**
 * Registers `layer` while `active`. Push on activation, removal on
 * deactivation or unmount. The latest callbacks are always used (kept in a
 * ref), so re-renders do not reorder the stack. One `document` keydown and one
 * mousedown listener serve the whole stack, attached only while it is
 * non-empty.
 */
export function useLayer(active: boolean, layer: Layer): void {
  const ref = useRef(layer);
  // Declared first, so it runs before the registration effect below.
  useLayoutEffect(() => {
    ref.current = layer;
  });

  // Layout effect: a layer opened by a click registers before the next keydown.
  useLayoutEffect(() => {
    if (!active) return;
    stack.push(ref);
    if (stack.length === 1) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleMouseDown);
    }
    return () => {
      const index = stack.indexOf(ref);
      if (index !== -1) stack.splice(index, 1);
      if (stack.length === 0) {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [active]);
}
