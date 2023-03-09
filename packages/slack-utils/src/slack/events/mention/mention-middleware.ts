import type { AllMiddlewareArgs, App, AppMentionEvent, SlackEventMiddlewareArgs } from '@slack/bolt';
import { fetchChatCompletion, FetchChatCompletionArgs } from '../../../openai/chat-completion';
import { convertChatCompletionMessages } from '../../../openai/chat-completion/convert-messages';
import { fetchThreadMessagesIfCan } from '../../fetch/fetch-thred';
import { trimMentions } from '../../trim';

export type GenerateMiddlewareMentionArgs = {
  openAiApiKey: string;
  appLog?: (args: unknown) => unknown;
  errorLog?: (args: unknown) => unknown;
} & Pick<FetchChatCompletionArgs, 'max_tokens'>;

type MiddlewareMentionArgs = Omit<SlackEventMiddlewareArgs, 'event'> &
  AllMiddlewareArgs & {
    event: AppMentionEvent;
  };

export function generateMiddlewareMention({
  openAiApiKey,
  appLog,
  errorLog,
  max_tokens,
}: GenerateMiddlewareMentionArgs) {
  return async ({ event, say, context, client }: MiddlewareMentionArgs) => {
    appLog?.(event);
    appLog?.(context);
    const trimmedText = trimMentions(event.text);
    if (context.retryNum !== undefined) {
      // If when retry, not say
      appLog?.('not say');
      return;
    }
    try {
      appLog?.('try fetch thread messages');
      const threadMessages = await fetchThreadMessagesIfCan({
        client,
        channel: event.channel,
        thread_ts: event.thread_ts,
      });
      appLog?.(threadMessages);
      const messages = convertChatCompletionMessages({ threadMessages });
      // Fetch OpenAI
      appLog?.('try fetch openai');
      appLog?.(trimmedText);
      const messageFromBot = await fetchChatCompletion({
        messages,
        apiKey: openAiApiKey,
        userContent: trimmedText,
        userName: event.user,
        max_tokens,
      });
      // Say Slack
      appLog?.('try say slack');
      const sayArgs = { thread_ts: event.ts, text: messageFromBot };
      await say(sayArgs).then(() => {
        appLog?.(sayArgs);
      });
    } catch (error) {
      errorLog?.(error);
      await say(`${error?.toString()}`);
    }
  };
}
