import { Git, Logger, RunWithSpinner, ClonedRepository } from './types';

export interface CheckoutReposCreation {
  logger: Logger;
  git: Git;
  runWithSpinner?: RunWithSpinner;
}

export function makeCheckoutRepos(creation: CheckoutReposCreation) {
  const {
    git,
    logger,
    runWithSpinner = async (x: any) => await x(),
  } = creation;

  return async (repositories: ClonedRepository[]): Promise<void> => {
    try {
      await runWithSpinner(
        async () =>
          await Promise.all(repositories.map((r) => checkoutSingleRepo(r))),
        'checking out repositories...'
      );
      logger.info('checked out repositories');
    } catch (e) {
      logger.error(`error when checking out repositories: ${e.message}`);
      throw e;
    }
  };

  async function checkoutSingleRepo(repo: ClonedRepository): Promise<void> {
    const { tag = 'master', name, dir } = repo;
    logger.debug(`checking out ${tag} of ${name}...`);
    await git.checkout(tag, dir);
  }
}
