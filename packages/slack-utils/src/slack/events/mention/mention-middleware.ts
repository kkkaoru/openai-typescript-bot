import type { AppLogger } from '../../../types/logger';
import type { OpenaiParameters } from '../../../types/openai';
import type { MiddlewareMentionArgs } from '../../../types/slack';
import { answer } from './answer';

export type GenerateMiddlewareMentionArgs = {
  openai?: OpenaiParameters;
} & AppLogger;

export function generateMiddlewareMention({ appLog, errorLog, openai }: GenerateMiddlewareMentionArgs) {
  return async (middlewareMentionArgs: MiddlewareMentionArgs) => {
    const { event, context, say } = middlewareMentionArgs;
    appLog?.(event);
    appLog?.(context);
    if (context.retryNum !== undefined) {
      // If when retry, not say
      appLog?.('not say');
      return;
    }
    try {
      answer({ ...middlewareMentionArgs, openai });
    } catch (error) {
      errorLog?.(error);
      await say({ thread_ts: event.ts, text: `${error?.toString()}` });
    }
  };
}
