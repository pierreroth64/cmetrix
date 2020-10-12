import { FileOps, Logger, ClonedRepository, RunWithSpinner } from './types';

export interface RemoveLocalReposCreation {
  logger: Logger;
  fileOps: FileOps;
  runWithSpinner?: RunWithSpinner;
}

export function makeRemoveTemporaryLocalRepos(
  creation: RemoveLocalReposCreation
) {
  const {
    fileOps,
    logger,
    runWithSpinner = async (x: any) => await x(),
  } = creation;

  return async (repositories: ClonedRepository[]): Promise<void> => {
    try {
      const results = await runWithSpinner(
        async () =>
          await Promise.all(repositories.map((r) => removeSingleRepo(r))),
        'removing temporary local repositories...'
      );
      const removed = results.filter((x: boolean) => x).length;
      logger.info(`removed ${removed} temporary local repositories`);
    } catch (e) {
      logger.error(
        `error when removing temporary local repositories: ${e.message}`
      );
      throw e;
    }
  };

  async function removeSingleRepo(repo: ClonedRepository): Promise<boolean> {
    if (repo.toBeRemoved) {
      await fileOps.remove(repo.dir);
      return true;
    }
    return false;
  }
}
