import { FileOps, Logger, ClonedRepository, RunWithSpinner } from './types';

export interface RemoveLocalRepoCreation {
  logger: Logger;
  fileOps: FileOps;
  runWithSpinner?: RunWithSpinner;
}

export function makeRemoveTemporaryLocalRepo(
  creation: RemoveLocalRepoCreation
) {
  const {
    fileOps,
    logger,
    runWithSpinner = async (x: any) => await x(),
  } = creation;

  return async (repository: ClonedRepository): Promise<ClonedRepository> => {
    try {
      return await runWithSpinner(
        async () => await removeRepo(repository),
        `removing temporary local repository ${repository.name}...`
      );
    } catch (e) {
      logger.error(
        `error when removing temporary local repository ${repository.name}: ${e.message}`
      );
      throw e;
    }
  };

  async function removeRepo(repo: ClonedRepository): Promise<ClonedRepository> {
    if (repo.toBeRemoved) {
      await fileOps.remove(repo.dir);
    }
    return repo;
  }
}
