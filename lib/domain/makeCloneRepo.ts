import { Git, FileOps, Logger, ClonedRepository, Repository } from './types';

export interface CloneRepoCreation {
  logger: Logger;
  git: Git;
  fileOps: FileOps;
}

export function makeCloneRepo(creation: CloneRepoCreation) {
  const { fileOps, git, logger } = creation;

  return async (repository: Repository): Promise<ClonedRepository> => {
    const { name } = repository;
    try {
      logger.info(`cloning repository ${name}...`);
      const result = await mayCloneRepo(repository);
      logger.info(`cloned repository ${name}`);
      return result;
    } catch (e) {
      logger.error(`error when cloning repository ${name}: ${e.message}`);
      throw e;
    }
  };

  async function mayCloneRepo(
    repository: Repository
  ): Promise<ClonedRepository> {
    const { url } = repository;

    if (!(await fileOps.doesExist(url))) {
      const tempDir = await fileOps.createTemporaryDirectory();
      await git.clone(url, tempDir);
      return Object.assign({}, repository, {
        dir: tempDir,
        toBeRemoved: true,
      });
    }
    logger.debug(`no need to clone existing repository: ${url}`);
    return Object.assign({}, repository, {
      dir: url,
      toBeRemoved: false,
    });
  }
}
