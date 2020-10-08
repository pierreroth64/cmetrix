import { GenerateOutputCreation } from './types';
import { OutputFormat } from '../types';
import { makeGenerateJSONOutput } from './makeGenerateJSONOutput';
import { makeGenerateHTMLOutput } from './makeGenerateHTMLOutput';

export function makeGenerateOutput(creation: GenerateOutputCreation) {
  const { format = OutputFormat.json } = creation;
  switch (format) {
    default:
    case OutputFormat.json:
      return makeGenerateJSONOutput(creation);
    case OutputFormat.html:
      return makeGenerateHTMLOutput(creation);
  }
}
