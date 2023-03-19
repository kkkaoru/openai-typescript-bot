// Cannot resolve error about 'node:timers/promises' in rollup
export function sleep(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
