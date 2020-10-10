import path from 'path';

import { ProjectMetrics } from '../types';
import { GenerateOutputCreation } from './types';

export function makeGenerateJSONOutput(creation: GenerateOutputCreation) {
  const { logger, outDir = process.cwd(), fileOps } = creation;

  return async function generateJSONOutput(
    metrics: ProjectMetrics[]
  ): Promise<any> {
    logger.debug('generating json projects metrics...');

    const destPath = path.join(outDir, 'metrics.json');

    await fileOps.writeText(
      destPath,
      JSON.stringify({ projects: metrics }, null, 4)
    );

    return destPath;
  };
}
