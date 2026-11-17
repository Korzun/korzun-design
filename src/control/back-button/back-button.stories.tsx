import type { Story, StoryDefault } from '@gallery/story';
import type { ComponentProps } from 'react';

import { BackButton } from './index.js';

type Props = ComponentProps<typeof BackButton>;

export default { title: 'Control / BackButton' } satisfies StoryDefault<Props>;

export const Default: Story<Props> = (args) => <BackButton {...args} to="/" />;
