import { ChatCompletionRequestMessage, ConfigurationParameters, CreateChatCompletionRequest } from 'openai';
import { createOpenAIClient } from '../openai-client/create-openai-client';
import { CHAT_COMPLETION_SYSTEM_CONTENT } from './system-content';

export type FetchChatCompletionArgs = {
  model?: string;
  userContent: string;
  userName?: string;
  enabledSystemContent?: boolean;
} & ConfigurationParameters &
  Pick<CreateChatCompletionRequest, 'max_tokens' | 'temperature' | 'messages'>;

export async function fetchChatCompletion({
  apiKey,
  model = 'gpt-3.5-turbo',
  max_tokens = 4000,
  temperature = 0.8,
  messages,
  userContent,
  userName,
  enabledSystemContent = false,
}: FetchChatCompletionArgs): Promise<string | undefined> {
  const client = createOpenAIClient({ apiKey });
  const systemMessage: ChatCompletionRequestMessage[] = enabledSystemContent
    ? [
        {
          role: 'system',
          content: CHAT_COMPLETION_SYSTEM_CONTENT,
        },
      ]
    : [];
  const result = await client.createChatCompletion({
    model,
    max_tokens,
    temperature,
    messages: [
      ...systemMessage,
      ...messages,
      {
        role: 'user',
        content: userContent,
        name: userName,
      },
    ],
  });
  return result.data.choices[0].message?.content;
}
