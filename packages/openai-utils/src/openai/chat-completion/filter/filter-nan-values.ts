import { ChatCompletionOptionalParameters } from '../../../types';

export function filterIsNaNValues(
  params: Partial<ChatCompletionOptionalParameters>,
): Partial<ChatCompletionOptionalParameters> {
  return Object.fromEntries(Object.entries(params).filter(([_, v]) => !Number.isNaN(v)));
}
