import { makeUniqueMessages } from './make-unique-messages';

test('should make unique messages', () => {
  expect(
    makeUniqueMessages([
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
    ]),
  ).toStrictEqual([
    {
      text: 'mock text',
      ts: '1',
    },
  ]);
});
