import { createLoggerMock, createFileOpsMock } from '../tests';

import { makeRemoveTemporaryLocalRepos } from './makeRemoveTemporaryLocalRepos';

describe('Remove temporary repositories', () => {
  let removeTemporaryLocalRepos: any;
  let fileOps: any;

  beforeEach(() => {
    fileOps = createFileOpsMock();
    removeTemporaryLocalRepos = makeRemoveTemporaryLocalRepos({
      logger: createLoggerMock(),
      fileOps,
    });
  });

  it('when repository marked to be removed, should call underlying remove', async () => {
    await removeTemporaryLocalRepos([
      {
        name: 'my-repo',
        url: 'http://www.wow.com/my-repot.git',
        dir: 'my-dir',
        toBeRemoved: true,
      },
    ]);
    expect(fileOps.remove).toHaveBeenCalled();
  });

  it('when repository not marked to be removed, should not call underlying remove', async () => {
    await removeTemporaryLocalRepos([
      {
        name: 'my-repo',
        url: 'http://www.wow.com/my-repot.git',
        dir: 'my-dir',
        toBeRemoved: false,
      },
    ]);
    expect(fileOps.remove).not.toHaveBeenCalled();
  });
});
