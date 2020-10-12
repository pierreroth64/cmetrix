import { createLoggerMock, createFileOpsMock, createGitMock } from '../tests';

import { makeCloneRepos } from './makeCloneRepos';

describe('Clone repositories', () => {
  let cloneRepos: any;
  let fileOps: any;

  beforeEach(() => {
    fileOps = createFileOpsMock();
    cloneRepos = makeCloneRepos({
      logger: createLoggerMock(),
      fileOps,
      git: createGitMock(),
    });
  });

  it('when url is an existing local repo, should _not_ mark repository to be removed', async () => {
    fileOps.doesExist = jest.fn().mockResolvedValue(true);

    const cloned = await cloneRepos([{ name: 'my-repo', url: 'my-repo-dir' }]);

    expect(cloned[0].toBeRemoved).toBeFalsy();
  });

  it('when url is not an existing local repo, should mark repository to be removed', async () => {
    fileOps.doesExist = jest.fn().mockResolvedValue(false);

    const cloned = await cloneRepos([{ name: 'my-repo', url: 'my-repo-dir' }]);

    expect(cloned[0].toBeRemoved).toBeTruthy();
  });
});
