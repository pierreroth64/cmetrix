import { FileOps, Logger, ClonedRepository } from './types';

export interface RemoveLocalRepoCreation {
  logger: Logger;
  fileOps: FileOps;
}

export function makeRemoveTemporaryLocalRepo(
  creation: RemoveLocalRepoCreation
) {
  const { fileOps, logger } = creation;

  return async (repository: ClonedRepository): Promise<ClonedRepository> => {
    try {
      return await removeRepo(repository);
    } catch (e) {
      logger.error(
        `error when removing temporary local repository ${repository.name}: ${e.message}`
      );
      throw e;
    }
  };

  async function removeRepo(repo: ClonedRepository): Promise<ClonedRepository> {
    const { toBeRemoved, name, dir } = repo;
    if (toBeRemoved) {
      logger.info(`removing cloned repository ${name} (dir: ${dir})...`);
      await fileOps.remove(dir);
      logger.info(`removed cloned repository ${name}`);
    }
    return repo;
  }
}
