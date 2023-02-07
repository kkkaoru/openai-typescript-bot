import {Configuration, OpenAIApi} from "openai";
import type {CreateCompletionResponse} from "openai";
type TextDavinchArgs = {
  prompt: string;
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
}

export async function fetchTextDavinci003({prompt, apiKey, maxTokens = 4096, temperature = 0.8}: TextDavinchArgs): Promise<CreateCompletionResponse> {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt || "Please tell me about ChatGPT.",
    max_tokens: maxTokens,
    temperature: temperature,
  });
  return response.data;
}
