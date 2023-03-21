export function removeNaNValues<T extends { [key: string]: number | unknown }>(params: T) {
  return Object.fromEntries(Object.entries(params).filter(([_, v]) => !Number.isNaN(v)));
}
