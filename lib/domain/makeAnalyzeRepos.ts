import { compose } from '@arpinum/promising';

import {
  Git,
  FileOps,
  Logger,
  RunWithSpinner,
  Repository,
  RepositoryMetrics,
  Shell,
} from './types';
import { makeCloneRepo } from './makeCloneRepo';
import { makeCheckoutRepo } from './makeCheckoutRepo';
import { makeCollectRepoMetrics } from './makeCollectRepoMetrics';
import { makeRemoveTemporaryLocalRepo } from './makeRemoveTemporaryLocalRepo';

export interface AnalyzeReposCreation {
  logger: Logger;
  git: Git;
  shell: Shell;
  fileOps: FileOps;
  runWithSpinner?: RunWithSpinner;
}

export function makeAnalyzeRepos(creation: AnalyzeReposCreation) {
  const {
    fileOps,
    git,
    logger,
    shell,
    runWithSpinner = async (x: any) => await x(),
  } = creation;

  const cloneRepo = makeCloneRepo({ git, logger, fileOps });
  const checkoutRepo = makeCheckoutRepo({ git, logger });
  const collectRepoMetrics = makeCollectRepoMetrics({
    logger,
    shell,
  });
  const removeTemporaryLocalRepo = makeRemoveTemporaryLocalRepo({
    logger,
    fileOps,
  });

  return async (repositories: Repository[]): Promise<RepositoryMetrics[]> => {
    try {
      const repoMetrics = await runWithSpinner(
        async () =>
          await Promise.all(
            repositories.map((r) =>
              compose([
                cloneRepo,
                checkoutRepo,
                collectRepoMetrics,
                removeTemporaryLocalRepo,
              ])(r)
            )
          ),
        'analyzing repositories...'
      );
      logger.info('analyzed repositories');
      return repoMetrics;
    } catch (e) {
      logger.error(`error when analyzing repositories: ${e.message}`);
      throw e;
    }
  };
}
