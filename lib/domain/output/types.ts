import {
  FileOps,
  Logger,
  OutputFormat,
  RunWithSpinner,
  TemplateEngine,
} from '../types';

export interface GenerateOutputCreation {
  fileOps: FileOps;
  logger: Logger;
  templateEngine: TemplateEngine;
  runWithSpinner: RunWithSpinner;
  title?: string;
  format?: OutputFormat;
  outDir?: string;
}
