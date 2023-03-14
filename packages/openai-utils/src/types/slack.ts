import type { AllMiddlewareArgs, AppMentionEvent, SlackEventMiddlewareArgs } from '@slack/bolt';

export type MiddlewareMentionArgs = Omit<SlackEventMiddlewareArgs, 'event'> &
  AllMiddlewareArgs & {
    event: AppMentionEvent;
  };
