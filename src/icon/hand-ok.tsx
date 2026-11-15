import { EmojiIcon } from './emoji.js';
import { IconProps } from './props.js';

// OK hand 👌 (U+1F44C) as a currentColor silhouette; rating 2, Okay.
export const HandOkIcon = (props: IconProps) => <EmojiIcon glyph={'\u{1F44C}'} {...props} />;
