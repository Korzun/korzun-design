import { EmojiIcon } from './emoji.js';
import { IconProps } from './props.js';

// Thumbs down 👎 (U+1F44E) as a currentColor silhouette; rating 1, Bad.
export const ThumbDownIcon = (props: IconProps) => <EmojiIcon glyph={'\u{1F44E}'} {...props} />;
