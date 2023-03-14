import { convertChatCompletionMessagesFromSlack } from './convert-from-slack-messages';

const mockMessages = Array.from({ length: 30 }).map((_, index) =>
  index % 2 === 0
    ? {
        content: `a message ${index}`,
        bot_id: `mock_bot_id_${index}`,
      }
    : {
        content: `a message ${index}`,
        user: `user_${index}`,
      },
);

test('should convert messages', () => {
  const messages = convertChatCompletionMessagesFromSlack({
    slackMessages: [
      {
        bot_id: 'B01',
        text: 'Hello',
      },
      {
        text: 'Mocked message',
        user: 'U01',
      },
    ],
  });
  expect(messages).toStrictEqual([
    {
      content: 'Hello',
      name: undefined,
      role: 'assistant',
    },
    {
      content: 'Mocked message',
      name: 'U01',
      role: 'user',
    },
  ]);
});

test('should occur error exception', () => {
  expect(() => {
    convertChatCompletionMessagesFromSlack({
      slackMessages: [],
      maxMessagesCount: 0,
    });
  }).toThrow('Max messages count must be greater than 0');
});

test('should not throw error when max messages count greater than 1', () => {
  expect(() => {
    convertChatCompletionMessagesFromSlack({
      slackMessages: [],
      maxMessagesCount: 1,
    });
  }).not.toThrow('Max messages count must be greater than 0 ');
});

test('should resize messages from default messages count', () => {
  expect(
    convertChatCompletionMessagesFromSlack({
      slackMessages: mockMessages,
      maxMessagesCount: undefined,
    }).length,
  ).toBe(18);
});
