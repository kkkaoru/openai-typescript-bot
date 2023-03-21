export function orderAscNumber<T>(list: T[], propertyKey: keyof T): T[] {
  return list.sort((prev, cur) => Number(prev[propertyKey]) - Number(cur[propertyKey]));
}
