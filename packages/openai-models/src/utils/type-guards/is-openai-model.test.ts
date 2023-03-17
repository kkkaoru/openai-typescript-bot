import { isOpenAIModel } from './is-openai-model';

test('should return false', () => {
  expect(isOpenAIModel('mock')).toBe(false);
  expect(isOpenAIModel('')).toBe(false);
  expect(isOpenAIModel(false)).toBe(false);
  expect(isOpenAIModel(undefined)).toBe(false);
});

test('should return true', () => {
  expect(isOpenAIModel('gpt-4')).toBe(true);
  expect(isOpenAIModel('gpt-3.5-turbo')).toBe(true);
});
