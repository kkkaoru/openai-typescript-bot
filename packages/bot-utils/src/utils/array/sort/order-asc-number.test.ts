import { orderAscNumber } from './order-asc-number';

test('should make unique messages', () => {
  expect(
    orderAscNumber(
      [
        {
          text: 'mock text A',
          ts: '1',
        },
        {
          text: 'mock text B',
          ts: '4',
        },
        {
          text: 'mock text C',
          ts: '3',
        },
        {
          text: 'mock text D',
          ts: '2',
        },
      ],
      'ts',
    ),
  ).toStrictEqual([
    {
      text: 'mock text A',
      ts: '1',
    },
    {
      text: 'mock text D',
      ts: '2',
    },
    {
      text: 'mock text C',
      ts: '3',
    },
    {
      text: 'mock text B',
      ts: '4',
    },
  ]);
});
