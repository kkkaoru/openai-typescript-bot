import type { ChatCompletionRequestMessage } from 'openai';
import type { AppMentionEvent } from '@slack/bolt';
import { convertChatCompletionMessagesFromSlack, MaxChatCompletionMessages } from '@kkkaoru/openai-utils';
import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import { convertMessageFromMentionEvent } from '../converter';
import { makeUniqueMessages } from '../unique';

export type CreateChatCompletionRequestMessagesArgs = {
  event: AppMentionEvent;
  threadMessages: Message[];
} & MaxChatCompletionMessages;

export function createChatCompletionRequestMessages({
  event,
  maxMessagesCount,
  threadMessages,
}: CreateChatCompletionRequestMessagesArgs): ChatCompletionRequestMessage[] {
  const mentionMessage = convertMessageFromMentionEvent(event);
  const uniqueMessages = makeUniqueMessages([...threadMessages, mentionMessage]);
  return convertChatCompletionMessagesFromSlack({
    slackMessages: uniqueMessages,
    maxMessagesCount,
  });
}
