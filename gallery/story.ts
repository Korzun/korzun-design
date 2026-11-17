import type { ReactElement } from 'react';

export type ArgType =
  | { control: 'boolean' }
  | { control: 'text' }
  | { control: 'number'; min?: number; max?: number; step?: number }
  | { control: 'select'; options: readonly string[] }
  | { control: 'action' };

export type ArgTypes<P> = Partial<Record<keyof P & string, ArgType>>;

export type StoryDefault<P = Record<string, unknown>> = {
  title: string;
  args?: Partial<P>;
  argTypes?: ArgTypes<P>;
  sheet?: boolean;
};

export type Story<P = Record<string, unknown>> = ((args: P) => ReactElement) & {
  storyName?: string;
  args?: Partial<P>;
  argTypes?: ArgTypes<P>;
};
