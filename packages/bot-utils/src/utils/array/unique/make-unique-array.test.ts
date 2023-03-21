import { makeUniqueArray } from './make-unique-array';

test('should make unique messages', () => {
  expect(
    makeUniqueArray(
      [
        {
          text: 'mock text',
          ts: '1',
        },
        {
          text: 'mock text',
          ts: '1',
        },
        {
          text: 'mock text',
          ts: '1',
        },
      ],
      'ts',
    ),
  ).toStrictEqual([
    {
      text: 'mock text',
      ts: '1',
    },
  ]);
});
