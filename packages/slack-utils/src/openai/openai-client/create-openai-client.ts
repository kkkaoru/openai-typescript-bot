import { OpenAIApi, Configuration, ConfigurationParameters } from 'openai';

export function createOpenAIClient({ apiKey }: ConfigurationParameters) {
  return new OpenAIApi(new Configuration({ apiKey }));
}
