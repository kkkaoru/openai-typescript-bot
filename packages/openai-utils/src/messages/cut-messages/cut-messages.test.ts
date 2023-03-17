import { cutMessages } from './cut-messages';

test('should return empty array', () => {
  expect(cutMessages([])).toStrictEqual([]);
});

test('should cut a half when even messages', () => {
  expect(
    cutMessages([
      {
        content: 'Hello1',
        role: 'user',
      },
      {
        content: 'Hello2',
        role: 'user',
      },
      {
        content: 'Hello3',
        role: 'user',
      },
      {
        content: 'Hello4',
        role: 'user',
      },
    ]),
  ).toStrictEqual([
    {
      content: 'Hello3',
      role: 'user',
    },
    {
      content: 'Hello4',
      role: 'user',
    },
  ]);
});

test('should cut a half when odd messages', () => {
  expect(
    cutMessages([
      {
        content: 'Hello1',
        role: 'user',
      },
      {
        content: 'Hello2',
        role: 'user',
      },
      {
        content: 'Hello3',
        role: 'user',
      },
      {
        content: 'Hello4',
        role: 'user',
      },
      {
        content: 'Hello5',
        role: 'user',
      },
    ]),
  ).toStrictEqual([
    {
      content: 'Hello3',
      role: 'user',
    },
    {
      content: 'Hello4',
      role: 'user',
    },
    {
      content: 'Hello5',
      role: 'user',
    },
  ]);
});
