import * as _ from 'lodash';

import { Logger, Shell, ClonedRepository, RepositoryMetrics } from './types';

export interface CollectRepoMetricsCreation {
  logger: Logger;
  shell: Shell;
}

interface ClocOptions {
  languages?: string[];
  excludeDirs?: string[];
}

export function makeCollectRepoMetrics(creation: CollectRepoMetricsCreation) {
  const { shell, logger } = creation;

  return async (repository: ClonedRepository): Promise<RepositoryMetrics> => {
    try {
      const { dir, languages, excludeDirs, name } = repository;
      logger.info(`collecting repository metrics for ${name}...`);
      const metrics = formatClocResult(
        await runCloc(dir, { languages, excludeDirs })
      );
      logger.info(`collected repository metrics for ${name}`);
      return {
        name,
        metrics,
        repository,
      };
    } catch (e) {
      logger.error(`error when collecting projects metrics: ${e.message}`);
      throw e;
    }
  };

  async function runCloc(dir: string, options?: ClocOptions): Promise<any> {
    const { languages, excludeDirs } = _.defaults({}, options, {
      languages: [],
      excludeDirs: [],
    });

    const extraArgs: string[] = [];

    if (languages && languages.length) {
      extraArgs.push(`--include-lang=${languages.join(',')}`);
    }
    if (excludeDirs && excludeDirs.length) {
      extraArgs.push(`--exclude-dir=${excludeDirs.join(',')}`);
    }
    const args = ['.', '--json', ...extraArgs];

    logger.debug(`\nrunning command in dir ${dir}: cloc ${args.join(' ')}`);
    const { stdout: result } = await shell.run('cloc', args, {
      workingDirectory: dir,
    });
    return JSON.parse(result);
  }

  function formatClocResult(result: any): any {
    const formatted = Object.assign({}, result, { cumulated: result.SUM });
    delete formatted.SUM;
    return formatted;
  }
}
