import * as _ from 'lodash';

import { Logger, Shell, ClonedRepository, RepositoryMetrics } from './types';

export interface CollectRepoMetricsCreation {
  logger: Logger;
  shell: Shell;
}

export function makeCollectRepoMetrics(creation: CollectRepoMetricsCreation) {
  const { shell, logger } = creation;

  return async (repository: ClonedRepository): Promise<RepositoryMetrics> => {
    try {
      const { name } = repository;
      logger.info(`collecting repository metrics for ${name}...`);
      const metrics = formatClocResult(await runCloc(repository));
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

  async function runCloc(repository: ClonedRepository): Promise<any> {
    const { languages, excludeDirs, dir, name } = _.defaults({}, repository, {
      languages: [],
      excludeDirs: [],
    });

    const extraArgs: string[] = [];

    if (languages && languages.length) {
      extraArgs.push(`--include-lang=${languages.join(',')}`);
    }
    if (excludeDirs && excludeDirs.length) {
      extraArgs.push(
        `--not-match-d="${(excludeDirs as string[])
          .map((d) => d.replace('/', '\\/'))
          .join('|')}"`
      );
    }
    const args = ['.', '--json', ...extraArgs];

    logger.debug(
      `running command in dir ${dir} (cloned repo ${name}): cloc ${args.join(
        ' '
      )}`
    );
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
