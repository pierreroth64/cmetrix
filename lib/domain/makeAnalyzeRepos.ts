import { pipe } from '@arpinum/promising';

import {
  Git,
  FileOps,
  Logger,
  Repository,
  RepositoryMetrics,
  Shell,
  ClonedRepository,
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
          pipe([cloneRepo, checkoutRepo, collectRepoMetrics])(r).then(
            (metrics: RepositoryMetrics) => {
              return onAnalyzed
                ? onAnalyzed(metrics).then(() => metrics)
                : metrics;
            }
          )
        )
      );
      await removeTemporaryLocalRepos(repoMetrics.map((m) => m.repository));
      logger.info('analyzed repositories');
      return repoMetrics;
    } catch (e) {
      logger.error(`error when analyzing repositories: ${e.message}`);
      throw e;
    }

    async function removeTemporaryLocalRepos(localRepos: ClonedRepository[]) {
      for (const repo of localRepos) {
        await removeTemporaryLocalRepo(repo);
      }
    }
  };
}
