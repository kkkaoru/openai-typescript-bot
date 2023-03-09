import type { AppLogger, OpenaiParameters, MiddlewareMentionArgs } from '../../../types';
import { answer, AnswerArgs } from './answer';

export type GenerateMiddlewareMentionArgs = {
  openai?: OpenaiParameters;
} & AppLogger &
  AnswerArgs;

export function generateMiddlewareMention({ appLog, errorLog, ...args }: GenerateMiddlewareMentionArgs) {
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
      answer({ ...middlewareMentionArgs, ...args });
    } catch (error) {
      errorLog?.(error);
      await say({ thread_ts: event.ts, text: `${error?.toString()}` });
    }
  };
}
