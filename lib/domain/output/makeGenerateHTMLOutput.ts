import path from 'path';
import { ProjectMetrics } from '../types';
import { GenerateOutputCreation } from './types';

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
    templatePath = path.join(__dirname, 'defaultTemplate.html'),
  } = creation;

  return async function generateHTMLOutput(
    metrics: ProjectMetrics[]
  ): Promise<any> {
    const destPath = path.join(outDir, 'index.html');
    logger.debug(`generating html projects metrics in ${destPath}...`);

    const template = await fileOps.readText(templatePath);
    const output = await templateEngine.run(
      { projects: metrics, title },
      template
    );
    await fileOps.writeText(destPath, output);

    return destPath;
  };
}
