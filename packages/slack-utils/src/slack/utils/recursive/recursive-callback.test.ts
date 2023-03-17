import { recursivePromiseCallback } from './recursive-callback';

test('should exec callback', async () => {
  const mockCallback = vi.fn();
  await recursivePromiseCallback({
    callback: mockCallback,
    retryMaxCount: 2,
    retryDelayMs: 1000,
  });
  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith({ retryCount: 0 });
});

test('should retry when callback failed', async () => {
  vi.useFakeTimers();
  const mockCallback = vi.fn().mockImplementationOnce(() => {
    throw new Error('mock error');
  });
  await recursivePromiseCallback({
    callback: mockCallback,
    retryMaxCount: 2,
    retryDelayMs: 1000,
  });
  await vi.runAllTimersAsync();
  expect(mockCallback).toHaveBeenCalledTimes(2);
});

test('should throw error after retry count is over max count', async () => {
  vi.useFakeTimers();
  const mockCallback = vi.fn().mockImplementation(() => {
    throw new Error('mock error');
  });

  await expect(async () => {
    await recursivePromiseCallback({
      callback: mockCallback,
      retryMaxCount: 3,
      retryDelayMs: 0,
    });
    await vi.runAllTimersAsync();
  }).rejects.toThrow('mock error');

  expect(mockCallback).toHaveBeenCalledTimes(4);
  expect(mockCallback).toHaveBeenNthCalledWith(2, { retryCount: 1 });
  expect(mockCallback).toHaveBeenNthCalledWith(3, { retryCount: 2 });
  expect(mockCallback).toHaveBeenNthCalledWith(4, { retryCount: 3 });
});
