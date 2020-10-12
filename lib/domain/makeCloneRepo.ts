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
  runWithSpinner?: RunWithSpinner;
}

export function makeCloneRepo(creation: CloneRepoCreation) {
  const {
    fileOps,
    git,
    logger,
    runWithSpinner = async (x: any) => await x(),
  } = creation;

  return async (repository: Repository): Promise<ClonedRepository> => {
    try {
      const result = await runWithSpinner(
        async () => mayCloneRepo(repository),
        `cloning repository ${repository.name}...`
      );
      logger.info(`cloned repository ${repository.name}`);
      return result;
    } catch (e) {
      logger.error(
        `error when cloning repository ${repository.name}: ${e.message}`
      );
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
