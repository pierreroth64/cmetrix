import path from 'path';
import { ProjectMetrics } from '../types';
import { GenerateOutputCreation } from './types';
const defaultTemplateContent = require('./defaultTemplate.html');

interface WithTemplate {
  templatePath?: string;
}

export type GenerateHTMLOutputCreation = GenerateOutputCreation & WithTemplate;

export function makeGenerateHTMLOutput(creation: GenerateHTMLOutputCreation) {
  const {
    logger,
    outDir = process.cwd(),
    title,
    fileOps,
    templateEngine,
    templatePath,
  } = creation;

  return async function generateHTMLOutput(
    metrics: ProjectMetrics[]
  ): Promise<any> {
    const destPath = path.join(outDir, 'index.html');
    logger.debug(`generating html projects metrics in ${destPath}...`);

    const templateContent = templatePath
      ? await fileOps.readText(templatePath)
      : defaultTemplateContent;
    const output = await templateEngine.run(
      { projects: metrics, title },
      templateContent
    );
    await fileOps.writeText(destPath, output);

    return destPath;
  };
}
