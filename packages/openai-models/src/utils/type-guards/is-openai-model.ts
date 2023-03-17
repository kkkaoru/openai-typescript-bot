import { openAIModels, OpenAiModel } from '../../types';

export function isOpenAIModel(model: unknown): model is OpenAiModel {
  return openAIModels.includes(model as OpenAiModel);
}
