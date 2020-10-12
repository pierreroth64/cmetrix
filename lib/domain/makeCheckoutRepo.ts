import { Git, Logger, RunWithSpinner, ClonedRepository } from './types';

export interface CheckoutRepoCreation {
  logger: Logger;
  git: Git;
  runWithSpinner?: RunWithSpinner;
}

export function makeCheckoutRepo(creation: CheckoutRepoCreation) {
  const {
    git,
    logger,
    runWithSpinner = async (x: any) => await x(),
  } = creation;

  return async (repository: ClonedRepository): Promise<ClonedRepository> => {
    try {
      const checkedOut = await runWithSpinner(
        async () => await checkoutSingleRepo(repository),
        `checking out repository ${repository.name}...`
      );
      logger.info(
        `checked out repository ${checkedOut.name} (${checkedOut.tag})`
      );
      return checkedOut;
    } catch (e) {
      logger.error(`error when checking out repositories: ${e.message}`);
      throw e;
    }
  };

  async function checkoutSingleRepo(
    repo: ClonedRepository
  ): Promise<ClonedRepository> {
    const { tag = 'master', dir } = repo;
    await git.checkout(tag, dir);
    return Object.assign({}, repo, { tag });
  }
}
