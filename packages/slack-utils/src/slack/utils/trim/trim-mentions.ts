export function trimMentions(text: string) {
  return text.trim().replace(/(<@.*?>\s?)/g, '');
}
