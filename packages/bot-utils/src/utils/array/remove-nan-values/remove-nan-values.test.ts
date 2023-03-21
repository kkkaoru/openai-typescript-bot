import { removeNaNValues } from './remove-nan-values';

test('should remove nan values', () => {
  expect(
    removeNaNValues({
      mockNumber: 1,
      mockString: 'mockString',
      mockArray: [1, 2, 3],
      mockNaNFoo: Number.NaN,
      mockNaNBar: Number.NaN,
    }),
  ).toStrictEqual({
    mockNumber: 1,
    mockString: 'mockString',
    mockArray: [1, 2, 3],
  });
});
