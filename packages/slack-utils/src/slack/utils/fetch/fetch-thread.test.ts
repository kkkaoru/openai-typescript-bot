import { WebClient } from '@slack/web-api';
import type { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse';
import { fetchThreadMessagesIfCan } from './fetch-thread';

test('should empty array if thread_ts is undefined', async () => {
  expect(
    await fetchThreadMessagesIfCan({
      client: vi.fn() as unknown as WebClient,
      channel: 'mock channel',
      thread_ts: undefined,
    }),
  ).toStrictEqual([]);
});

test('should empty array if messages is undefined', async () => {
  const mockReplies = vi.fn().mockResolvedValue({ messages: undefined });
  const client = {
    conversations: {
      replies: mockReplies,
    },
  } as unknown as WebClient;
  expect(
    await fetchThreadMessagesIfCan({
      client,
      channel: 'mock channel',
      thread_ts: '1234',
    }),
  ).toStrictEqual([]);
  expect(mockReplies).toHaveBeenCalledTimes(1);
  expect(mockReplies).toHaveBeenCalledWith({
    channel: 'mock channel',
    ts: '1234',
  });
});

test('should return messages', async () => {
  const mockReplies = vi.fn().mockResolvedValue({
    messages: [
      {
        text: '<@9999> mock text',
        ts: '1',
      },
      {
        text: '<@U56789> mock text 3',
        ts: '3',
      },
      {
        text: '<@U1234> mock text 2',
        ts: '2',
      },
    ] as Message[],
  });
  const client = {
    conversations: {
      replies: mockReplies,
    },
  } as unknown as WebClient;
  expect(
    await fetchThreadMessagesIfCan({
      client,
      channel: 'mock channel',
      thread_ts: '1234',
    }),
  ).toStrictEqual([
    {
      text: 'mock text',
      ts: '1',
    },
    {
      text: 'mock text 2',
      ts: '2',
    },
    {
      text: 'mock text 3',
      ts: '3',
    },
  ]);
  expect(mockReplies).toHaveBeenCalledTimes(1);
  expect(mockReplies).toHaveBeenCalledWith({
    channel: 'mock channel',
    ts: '1234',
  });
});
