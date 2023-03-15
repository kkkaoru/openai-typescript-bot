import type { AppLogger, CustomTextMessage, MiddlewareMentionArgs, OpenAiProps } from '../../../types';
import { sayAnswer } from './say-answer';

export type GenerateMiddlewareMentionArgs = CustomTextMessage & AppLogger & OpenAiProps;

export function generateMiddlewareMention({ appLog, errorLog, ...args }: GenerateMiddlewareMentionArgs) {
  return async ({ context, event, say, client }: MiddlewareMentionArgs) => {
    appLog?.(event);
    appLog?.(context);
    if (context.retryNum !== undefined) {
      // If when retry, not say
      appLog?.('not say');
    }
    try {
      appLog?.('try answer');
      await sayAnswer({ ...args, event, client, say, appLog, errorLog });
    } catch (error) {
      errorLog?.(error);
      await say({ thread_ts: event.ts, text: `${error?.toString()}` });
    }
  };
}
