import { EmojiIcon } from './emoji.js';
import { IconProps } from './props.js';

// Victory hand ✌️ (U+270C U+FE0F, the emoji presentation) as a currentColor silhouette; rating 3, Nice.
export const HandPeaceIcon = (props: IconProps) => (
  <EmojiIcon glyph={'\u{270C}\u{FE0F}'} {...props} />
);
