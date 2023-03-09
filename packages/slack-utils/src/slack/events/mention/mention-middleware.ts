import type { AllMiddlewareArgs, AppMentionEvent, SlackEventMiddlewareArgs } from '@slack/bolt';
import { ConfigurationParameters } from 'openai';
import {
  fetchChatCompletion,
  FetchChatCompletionArgs,
  ChatCompletionOptionalParameters,
} from '../../../openai/chat-completion';
import { convertChatCompletionMessages, MaxMessages } from '../../../openai/chat-completion/convert-messages';
import { fetchThreadMessagesIfCan } from '../../fetch/fetch-thred';
import { makeUniqueMessages } from '../../unique/make-unique-messages';
import { convertMessageFromMentionEvent } from './convert-event-to-message';

export type OpenaiParameters = Pick<ConfigurationParameters, 'apiKey'> & ChatCompletionOptionalParameters & MaxMessages;

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
      const mentionMessage = convertMessageFromMentionEvent(event);
      const uniqueMessages = makeUniqueMessages([...threadMessages, mentionMessage]);
      const messages = convertChatCompletionMessages({
        slackMessages: uniqueMessages,
        maxMessagesCount: openai?.maxMessagesCount,
      });
      // Fetch OpenAI
      appLog?.('try fetch openai');
      const fetchChatCompletionArgs: FetchChatCompletionArgs = {
        messages,
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
