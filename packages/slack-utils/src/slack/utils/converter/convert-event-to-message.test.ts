import { AppMentionEvent } from '@slack/bolt';

import { convertMessageFromMentionEvent } from './convert-event-to-message';

test('should convert messages', () => {
  expect(
    convertMessageFromMentionEvent({
      type: 'app_mention',
      username: 'mock username',
      ts: '1234',
      text: '<@U123> mock text',
    } as AppMentionEvent),
  ).toStrictEqual({
    ts: '1234',
    text: 'mock text',
  });
});
