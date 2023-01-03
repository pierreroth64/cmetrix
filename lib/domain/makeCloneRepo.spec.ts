import { createLoggerMock, createFileOpsMock, createGitMock } from '../tests';

import { makeCloneRepo, OnClonedHook } from './makeCloneRepo';
import { ClonedRepository } from './types';

describe('Clone repository', () => {
  let cloneRepo: any;
  let fileOps: any;
  let onCloned: OnClonedHook;
  let git: any;
  let clonedRepositories: ClonedRepository[];

  beforeEach(() => {
    clonedRepositories = [];
    git = createGitMock();
    onCloned = jest.fn().mockImplementation(async (r: ClonedRepository) => {
      clonedRepositories.push(r);
    });
    fileOps = createFileOpsMock();
    cloneRepo = makeCloneRepo({
      logger: createLoggerMock(),
      fileOps,
      git,
      hooks: {
        onCloned,
      },
    });
  });

  describe('when url is an existing local repo', () => {
    beforeEach(() => {
      fileOps.doesExist = jest.fn().mockResolvedValue(true);
    });

    it('should not clone existing repository', async () => {
      await cloneRepo({ name: 'my-repo', url: 'my-repo-dir' });

      expect(git.clone).not.toBeCalled();
    });

    it('should _not_ mark repository to be removed', async () => {
      const cloned = await cloneRepo({ name: 'my-repo', url: 'my-repo-dir' });

      expect(cloned.toBeRemoved).toBeFalsy();
    });
  });

  describe('when url is not an existing local repo', () => {
    beforeEach(() => {
      fileOps.doesExist = jest.fn().mockResolvedValue(false);
    });

    it('should clone repository', async () => {
      await cloneRepo({ name: 'my-repo', url: 'http://my-repo-url.git' });

      expect(git.clone).toBeCalledWith('http://my-repo-url.git', 'temp');
    });

    it('should call cloned hook', async () => {
      await cloneRepo({ name: 'my-repo', url: 'http://my-repo-url.git' });

      expect(onCloned).toBeCalledWith({
        dir: 'temp',
        name: 'my-repo',
        toBeRemoved: true,
        url: 'http://my-repo-url.git',
      });
      expect(clonedRepositories).toEqual([
        {
          dir: 'temp',
          name: 'my-repo',
          toBeRemoved: true,
          url: 'http://my-repo-url.git',
        },
      ]);
    });

    it('should mark repository to be removed', async () => {
      const cloned = await cloneRepo({
        name: 'my-repo',
        url: 'http://my-repo-url.git',
      });

      expect(cloned.toBeRemoved).toBeTruthy();
    });
  });
});
