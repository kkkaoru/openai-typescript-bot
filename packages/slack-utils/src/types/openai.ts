import { OpenaiParameters } from '@kkkaoru/openai-utils';

export type OpenAiProps = {
  openai: OpenaiParameters;
};

export type OpenAiParamsWithoutApiKey = Omit<OpenaiParameters, 'apiKey'>;
