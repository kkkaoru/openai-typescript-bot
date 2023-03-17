import { setTimeout } from 'node:timers/promises';
import type { AppLogger } from '../../../types';

export type RetryCallbackProps = {
  retryCount?: number;
  retryDelayMs?: number;
  retryMaxCount?: number;
};

export type RecursiveCallback = (args: Pick<RetryCallbackProps, 'retryCount'>) => Promise<unknown>;

export type RecursiveCallbackArgs = {
  callback: RecursiveCallback;
} & RetryCallbackProps &
  AppLogger;

export async function recursivePromiseCallback({
  callback,
  retryCount = 0,
  retryMaxCount = 3,
  retryDelayMs = 2000,
  appLog,
  errorLog,
}: RecursiveCallbackArgs): Promise<unknown> {
  try {
    appLog?.(`try count is ${retryCount}`);
    return await callback({ retryCount });
  } catch (error) {
    appLog?.(`failed count is ${retryCount}`);
    errorLog?.(error);
    if (retryCount >= retryMaxCount) {
      errorLog?.(`gave up count is ${retryCount}`);
      throw error;
    }
    await setTimeout(retryDelayMs);
    return recursivePromiseCallback({ callback, retryCount: retryCount + 1, retryMaxCount, retryDelayMs });
  }
}
