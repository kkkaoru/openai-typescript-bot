export function cutInRatio<T>(list: T[], ratio = 2): T[] {
  if (list.length <= 0) {
    return [];
  }
  return list.slice(Math.floor(list.length / ratio));
}
