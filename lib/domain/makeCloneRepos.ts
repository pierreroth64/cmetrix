import {
  Git,
  FileOps,
  Logger,
  RunWithSpinner,
  ClonedRepository,
  Repository,
} from './types';

export interface CloneRepoCreation {
  logger: Logger;
  git: Git;
  fileOps: FileOps;
  runWithSpinner: RunWithSpinner;
}

export function makeCloneRepos(creation: CloneRepoCreation) {
  const { fileOps, git, logger, runWithSpinner } = creation;

  return async (repositories: Repository[]): Promise<ClonedRepository[]> => {
    try {
      const results = await runWithSpinner(
        async () =>
          await Promise.all(repositories.map((r) => cloneSingleRepo(r))),
        'cloning repositories...'
      );
      logger.info('cloned repositories');
      return results;
    } catch (e) {
      logger.error(`error when cloning repositories: ${e.message}`);
      throw e;
    }
  };

  async function cloneSingleRepo(repo: Repository): Promise<ClonedRepository> {
    const { url } = repo;

    if (!(await fileOps.doesExist(url))) {
      const tempDir = await fileOps.createTemporaryDirectory();
      await git.clone(url, tempDir);
      return Object.assign({}, repo, {
        dir: tempDir,
        toBeRemoved: true,
      });
    }
    logger.debug(`no need to clone existing repo: ${url}`);
    return Object.assign({}, repo, {
      dir: url,
      toBeRemoved: false,
    });
  }
}
