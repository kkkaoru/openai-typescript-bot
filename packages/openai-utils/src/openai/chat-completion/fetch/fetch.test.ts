import type { OpenAIApi } from 'openai';
import { fetchChatCompletion } from './fetch';
import * as client from '../../openai-client';

const mockResponse = {
  data: {
    choices: [{ message: { content: 'mock-response' } }],
  },
};

vi.mock('../../openai-client');

test('should return message', async () => {
  vi.spyOn(client, 'createOpenAIClient').mockReturnValue({
    createChatCompletion: vi.fn().mockResolvedValue(mockResponse),
  } as unknown as OpenAIApi);
  const result = await fetchChatCompletion({
    clientParams: {
      apiKey: 'mock-api-key',
    },
    fetchParams: {
      messages: [],
    },
  });
  expect(result).toBe('mock-response');
});

test('should request messages includes system message', async () => {
  const mockCreateChatCompletion = vi.fn().mockResolvedValue(mockResponse);
  vi.spyOn(client, 'createOpenAIClient').mockReturnValue({
    createChatCompletion: mockCreateChatCompletion,
  } as unknown as OpenAIApi);

  await fetchChatCompletion({
    clientParams: {
      apiKey: 'mock-api-key',
    },
    fetchParams: {
      systemMessageContent: 'mock-system-message',
      messages: [
        {
          content: 'mock-user-message',
          role: 'user',
        },
        {
          content: 'mock-assistant-message',
          role: 'assistant',
        },
      ],
    },
  });

  expect(mockCreateChatCompletion).toHaveBeenCalledTimes(1);
  expect(mockCreateChatCompletion).toHaveBeenCalledWith({
    messages: [
      {
        content: 'mock-system-message',
        role: 'system',
      },
      {
        content: 'mock-user-message',
        role: 'user',
      },
      {
        content: 'mock-assistant-message',
        role: 'assistant',
      },
    ],
    model: 'gpt-3.5-turbo',
  });
});
