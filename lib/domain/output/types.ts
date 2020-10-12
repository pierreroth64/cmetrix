import { FileOps, Logger, OutputFormat, TemplateEngine } from '../types';

export interface GenerateOutputCreation {
  fileOps: FileOps;
  logger: Logger;
  templateEngine: TemplateEngine;
  title?: string;
  format?: OutputFormat;
  outDir?: string;
}
