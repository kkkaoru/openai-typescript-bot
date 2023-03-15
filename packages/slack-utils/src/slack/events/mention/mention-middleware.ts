import type { MiddlewareMentionArgs } from '../../../types';
import { sayAnswer, SayAnswerArgs } from './say-answer';

export type GenerateMiddlewareMentionArgs = SayAnswerArgs;

export function generateMiddlewareMention({ appLog, errorLog, ...args }: GenerateMiddlewareMentionArgs) {
  return async ({ context, event, say }: MiddlewareMentionArgs) => {
    appLog?.(event);
    appLog?.(context);
    if (context.retryNum !== undefined) {
      // If when retry, not say
      appLog?.('not say');
    }
    try {
      appLog?.('try answer');
      await sayAnswer({ ...args, event, appLog, errorLog });
    } catch (error) {
      errorLog?.(error);
      await say({ thread_ts: event.ts, text: `${error?.toString()}` });
    }
  };
}
