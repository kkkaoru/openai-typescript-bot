import { OpenAIApi, Configuration, ConfigurationParameters } from 'openai';

export function createOpenAIClient({ apiKey }: ConfigurationParameters): OpenAIApi {
  return new OpenAIApi(new Configuration({ apiKey }));
}
