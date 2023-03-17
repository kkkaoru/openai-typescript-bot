export function makeUniqueArray<T>(list: T[], propertyKey: keyof T): T[] {
  return list.filter((a, i) => list.findIndex((s) => a[propertyKey] === s[propertyKey]) === i);
}
