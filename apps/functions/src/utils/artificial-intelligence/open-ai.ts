import {Configuration, OpenAIApi} from "openai";
import type {CreateCompletionResponse} from "openai";

const TEXT_DAVINCI_003_ARGS = {
  model: "text-davinci-003",
  maxTokens: 4000,
  defaultPrompt: "Please tell me about ChatGPT.",
};

type TextDavinchArgs = {
  prompt: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

export async function fetchTextDavinci003({prompt, apiKey, maxTokens = TEXT_DAVINCI_003_ARGS.maxTokens, temperature = 0.8}: TextDavinchArgs): Promise<CreateCompletionResponse> {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: TEXT_DAVINCI_003_ARGS.model,
    prompt: prompt || TEXT_DAVINCI_003_ARGS.defaultPrompt,
    max_tokens: maxTokens,
    temperature,
  });
  return response.data;
}
