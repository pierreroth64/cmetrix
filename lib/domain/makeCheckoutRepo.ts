import { Git, Logger, ClonedRepository } from './types';

export interface CheckoutRepoCreation {
  logger: Logger;
  git: Git;
}

export function makeCheckoutRepo(creation: CheckoutRepoCreation) {
  const { git, logger } = creation;

  return async (repository: ClonedRepository): Promise<ClonedRepository> => {
    try {
      const checkedOut = await mayCheckoutSingleRepo(repository);
      logger.info(
        `checked out repository ${checkedOut.name} (${checkedOut.tag})`
      );
      return checkedOut;
    } catch (e) {
      logger.error(`error when checking out repositories: ${(e as Error).message}`);
      throw e;
    }
  };

  async function mayCheckoutSingleRepo(
    repo: ClonedRepository
  ): Promise<ClonedRepository> {
    const { tag, dir } = repo;
    if (tag) {
      await git.checkout(tag, dir);
      return Object.assign({}, repo, { tag });
    }
    return repo;
  }
}
