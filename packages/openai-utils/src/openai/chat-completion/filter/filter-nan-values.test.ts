import { filterIsNaNValues } from './filter-nan-values';

test('should filter nan values', () => {
  expect(
    filterIsNaNValues({
      max_tokens: 4000,
      temperature: Number.NaN,
      frequency_penalty: Number.NaN,
      top_p: Number.NaN,
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
    }),
  ).toStrictEqual({
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: 'Hello',
      },
    ],
  });
});
