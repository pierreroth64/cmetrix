import { createLoggerMock, createFileOpsMock } from '../tests';

import { makeRemoveTemporaryLocalRepo } from './makeRemoveTemporaryLocalRepo';

describe('remove temporary repository', () => {
  let removeTemporaryLocalRepo: any;
  let fileOps: any;

  beforeEach(() => {
    fileOps = createFileOpsMock();
    removeTemporaryLocalRepo = makeRemoveTemporaryLocalRepo({
      logger: createLoggerMock(),
      fileOps,
    });
  });

  it('when repository marked to be removed, should call underlying remove', async () => {
    await removeTemporaryLocalRepo({
      name: 'my-repo',
      url: 'http://www.wow.com/my-repot.git',
      dir: 'my-dir',
      toBeRemoved: true,
    });
    expect(fileOps.remove).toHaveBeenCalled();
  });

  it('when repository not marked to be removed, should not call underlying remove', async () => {
    await removeTemporaryLocalRepo({
      name: 'my-repo',
      url: 'http://www.wow.com/my-repot.git',
      dir: 'my-dir',
      toBeRemoved: false,
    });
    expect(fileOps.remove).not.toHaveBeenCalled();
  });
});
