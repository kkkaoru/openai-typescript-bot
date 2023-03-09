import type { AllMiddlewareArgs, AppMentionEvent, SlackEventMiddlewareArgs } from '@slack/bolt';
import { ConfigurationParameters } from 'openai';
import {
  fetchChatCompletion,
  FetchChatCompletionArgs,
  ChatCompletionOptionalParameters,
} from '../../../openai/chat-completion';
import { convertChatCompletionMessages } from '../../../openai/chat-completion/convert-messages';
import { fetchThreadMessagesIfCan } from '../../fetch/fetch-thred';
import { trimMentions } from '../../trim';

export type OpenaiParameters = Pick<ConfigurationParameters, 'apiKey'> & ChatCompletionOptionalParameters;

export type GenerateMiddlewareMentionArgs = {
  appLog?: (args: unknown) => unknown;
  errorLog?: (args: unknown) => unknown;
  openai?: OpenaiParameters;
};

type MiddlewareMentionArgs = Omit<SlackEventMiddlewareArgs, 'event'> &
  AllMiddlewareArgs & {
    event: AppMentionEvent;
  };

export function generateMiddlewareMention({ appLog, errorLog, openai }: GenerateMiddlewareMentionArgs) {
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
      const fetchChatCompletionArgs: FetchChatCompletionArgs = {
        messages,
        userContent: trimmedText,
        userName: event.user,
        ...openai,
      };
      appLog?.(fetchChatCompletionArgs);
      const messageFromBot = await fetchChatCompletion(fetchChatCompletionArgs);
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
