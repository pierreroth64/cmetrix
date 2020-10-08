import { ProjectMetrics } from '../types';
import { GenerateOutputCreation } from './types';

export function makeGenerateJSONOutput(creation: GenerateOutputCreation) {
  const { logger } = creation;

  return async function generateJSONOutput(
    metrics: ProjectMetrics[]
  ): Promise<any> {
    logger.debug('generating json projects metrics...');
    console.log(JSON.stringify({ projects: metrics }, null, 4));
  };
}
