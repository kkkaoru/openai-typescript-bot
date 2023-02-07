import {Configuration, OpenAIApi} from "openai";
import type {CreateCompletionResponse} from "openai";
type TextDavinchArgs = {
  prompt: string;
  apiKey: string;
  temperature?: number;
}

export async function fetchTextDavinci003({prompt, apiKey, temperature = 0.6}: TextDavinchArgs): Promise<CreateCompletionResponse> {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt || "Please tell me about ChatGPT.",
    temperature,
  });
  return response.data;
}
