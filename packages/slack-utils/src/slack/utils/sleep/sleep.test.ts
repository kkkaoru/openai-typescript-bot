import { sleep } from './sleep';

test('should resolve promise object', async () => {
  const mock = vi.fn();
  vi.useFakeTimers();
  sleep(100).then(() => {
    mock();
  });
  await vi.runAllTimersAsync();
  expect(mock).toHaveBeenCalledTimes(1);
});
