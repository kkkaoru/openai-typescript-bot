import { recursivePromiseCallback } from './recursive-callback';

vi.mock('../sleep/sleep', () => ({
  sleep: vi.fn().mockResolvedValue(vi.fn()),
}));

test('should exec callback', async () => {
  const mockCallback = vi.fn();
  const appLog = vi.fn();
  await recursivePromiseCallback({
    callback: mockCallback,
    retryMaxCount: 2,
    retryDelayMs: 1000,
    appLog,
  });
  expect(appLog).toHaveBeenCalledTimes(1);
  expect(appLog).toHaveBeenCalledWith('try count is 0');
  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith({ retryCount: 0 });
});

test('should retry when callback failed', async () => {
  const mockCallback = vi.fn().mockImplementationOnce(() => {
    throw new Error('mock error');
  });
  const appLog = vi.fn();
  const errorLog = vi.fn();
  await recursivePromiseCallback({
    callback: mockCallback,
    retryMaxCount: 2,
    retryDelayMs: 1000,
    appLog,
    errorLog,
  });
  expect(mockCallback).toHaveBeenCalledTimes(2);
  expect(appLog).toHaveBeenCalledTimes(2);
  expect(errorLog).toHaveBeenCalledTimes(1);
  expect(errorLog).toHaveBeenCalledWith(new Error('mock error'));
});

test('should throw error after retry count is over max count', async () => {
  const mockCallback = vi.fn().mockImplementation(() => {
    throw new Error('mock error');
  });

  await expect(async () => {
    await recursivePromiseCallback({
      callback: mockCallback,
      retryMaxCount: 3,
      retryDelayMs: 0,
    });
  }).rejects.toThrow('mock error');

  expect(mockCallback).toHaveBeenCalledTimes(4);
  expect(mockCallback).toHaveBeenNthCalledWith(2, { retryCount: 1 });
  expect(mockCallback).toHaveBeenNthCalledWith(3, { retryCount: 2 });
  expect(mockCallback).toHaveBeenNthCalledWith(4, { retryCount: 3 });
});
