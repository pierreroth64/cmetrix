import { Git, Logger, ClonedRepository } from './types';

export interface CheckoutRepoCreation {
  logger: Logger;
  git: Git;
}

export function makeCheckoutRepo(creation: CheckoutRepoCreation) {
  const { git, logger } = creation;

  return async (repository: ClonedRepository): Promise<ClonedRepository> => {
    try {
      return mayCheckoutSingleRepo(repository);
    } catch (e) {
      logger.error(
        `error when checking out repository ${repository.name}: ${
          (e as Error).message
        }`
      );
      throw e;
    }
  };

  async function mayCheckoutSingleRepo(
    repo: ClonedRepository
  ): Promise<ClonedRepository> {
    const { tag, dir } = repo;
    if (tag) {
      await git.checkout(tag, dir);
      logger.info(`checked out repository ${repo.name}`);
      return Object.assign({}, repo, { tag });
    } else {
      logger.debug(`no checkout for ${repo.name} as tag is not defined`);
    }
    return repo;
  }
}
