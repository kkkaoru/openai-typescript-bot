export function trimMentions(text: string) {
  return text.replace(/(<@.*?>\s?)/g, '');
}
