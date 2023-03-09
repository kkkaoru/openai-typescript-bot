import type { App } from '@slack/bolt';

import { generateMiddlewareMention, GenerateMiddlewareMentionArgs } from './mention-middleware';

export type SetMentionEventArgs = {
  app: App;
} & GenerateMiddlewareMentionArgs;

// Require app_mentions:read
export function setMentionEvent({ app, ...args }: SetMentionEventArgs) {
  const mentionMiddleWare = generateMiddlewareMention({ ...args });
  app.event('app_mention', mentionMiddleWare);
}
