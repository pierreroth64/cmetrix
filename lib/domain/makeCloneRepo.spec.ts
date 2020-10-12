import { createLoggerMock, createFileOpsMock, createGitMock } from '../tests';

import { makeCloneRepo } from './makeCloneRepo';

describe('Clone repository', () => {
  let cloneRepo: any;
  let fileOps: any;

  beforeEach(() => {
    fileOps = createFileOpsMock();
    cloneRepo = makeCloneRepo({
      logger: createLoggerMock(),
      fileOps,
      git: createGitMock(),
    });
  });

  it('when url is an existing local repo, should _not_ mark repository to be removed', async () => {
    fileOps.doesExist = jest.fn().mockResolvedValue(true);

    const cloned = await cloneRepo({ name: 'my-repo', url: 'my-repo-dir' });

    expect(cloned.toBeRemoved).toBeFalsy();
  });

  it('when url is not an existing local repo, should mark repository to be removed', async () => {
    fileOps.doesExist = jest.fn().mockResolvedValue(false);

    const cloned = await cloneRepo({ name: 'my-repo', url: 'my-repo-dir' });

    expect(cloned.toBeRemoved).toBeTruthy();
  });
});
