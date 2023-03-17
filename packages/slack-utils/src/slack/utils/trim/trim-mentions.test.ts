import { trimMentions } from './trim-mentions';

test('should trim mentions', () => {
  expect(trimMentions('<@U123> mock text')).toBe('mock text');
  expect(trimMentions('<@U123> mock text    ')).toBe('mock text');
});
