import { cutInRatio } from './cut-in-ratio';

test('should return empty array', () => {
  expect(cutInRatio([])).toStrictEqual([]);
});

test('should cut in half', () => {
  expect(cutInRatio([1, 2, 3, 4, 5])).toStrictEqual([3, 4, 5]);
  expect(cutInRatio([1, 2, 3, 4])).toStrictEqual([3, 4]);
});
