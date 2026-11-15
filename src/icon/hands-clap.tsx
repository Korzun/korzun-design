import { EmojiIcon } from './emoji.js';
import { IconProps } from './props.js';

// Clapping hands 👏 (U+1F44F) as a currentColor silhouette; rating 4, Great.
export const HandsClapIcon = (props: IconProps) => <EmojiIcon glyph={'\u{1F44F}'} {...props} />;
