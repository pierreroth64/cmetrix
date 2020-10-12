import { compose } from '@arpinum/promising';

import {
  Git,
  FileOps,
  Logger,
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
}

export type OnAnalyzedRepository = (
  repoMetrics: RepositoryMetrics
) => Promise<void>;

export function makeAnalyzeRepos(creation: AnalyzeReposCreation) {
  const { fileOps, git, logger, shell } = creation;

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

  return async (
    repositories: Repository[],
    onAnalyzed?: OnAnalyzedRepository
  ): Promise<RepositoryMetrics[]> => {
    try {
      logger.info('analyzing repositories...');
      const repoMetrics = await Promise.all(
        repositories.map((r) =>
          compose([
            cloneRepo,
            checkoutRepo,
            collectRepoMetrics,
            removeTemporaryLocalRepo,
          ])(r).then((metrics: RepositoryMetrics) => {
            return onAnalyzed
              ? onAnalyzed(metrics).then(() => metrics)
              : metrics;
          })
        )
      );
      logger.info('analyzed repositories');
      return repoMetrics;
    } catch (e) {
      logger.error(`error when analyzing repositories: ${e.message}`);
      throw e;
    }
  };
}
