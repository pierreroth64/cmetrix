import _ from 'lodash';
import { Git, FileOps, Logger, ClonedRepository, Repository } from './types';

export interface CloneRepoCreation {
  logger: Logger;
  git: Git;
  fileOps: FileOps;
  hooks?: {
    onCloned: OnClonedHook;
  };
}

export type OnClonedHook = (r: ClonedRepository) => Promise<void>;

export function makeCloneRepo(creation: CloneRepoCreation) {
  const { fileOps, git, logger, hooks } = creation;
  const { onCloned } = _.defaults(hooks, {
    onCloned: async (_: ClonedRepository) => {},
  });

  return async function cloneRepo(
    repository: Repository
  ): Promise<ClonedRepository> {
    const { name } = repository;
    try {
      logger.info(`cloning repository ${name}...`);
      const result = await mayCloneRepo(repository);
      logger.info(`cloned repository ${name}`);
      return result;
    } catch (e) {
      logger.error(
        `error when cloning repository ${name}: ${(e as Error).message}`
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
      const cloned = Object.assign({}, repository, {
        dir: tempDir,
        toBeRemoved: true,
      });
      onCloned(cloned);
      return cloned;
    }
    logger.debug(`no need to clone existing repository: ${url}`);
    return Object.assign({}, repository, {
      dir: url,
      toBeRemoved: false,
    });
  }
}
