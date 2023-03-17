import { OpenAIApi, Configuration } from 'openai';
import { createOpenAIClient } from './create-openai-client';

vi.mock('openai', () => ({
  Configuration: vi.fn(),
  OpenAIApi: vi.fn(),
}));

test('should return openai client', () => {
  const client = createOpenAIClient({ apiKey: 'sk-mockXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' });
  expect(Configuration).toHaveBeenCalledTimes(1);
  expect(Configuration).toHaveBeenCalledWith({ apiKey: 'sk-mockXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' });
  expect(OpenAIApi).toHaveBeenCalledTimes(1);
  expect(client).not.toBe(undefined);
});
