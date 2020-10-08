import { createLoggerMock } from '../tests';

import { makeCheckConfiguration } from './makeCheckConfiguration';

describe('check configuration', () => {
  let logger: any;
  let checkConfiguration: any;

  beforeEach(() => {
    logger = createLoggerMock();
    checkConfiguration = makeCheckConfiguration({ logger });
  });

  it('should throw error when repository duplicates', () => {
    expect(() =>
      checkConfiguration({
        projects: [],
        repositories: [{ name: 'repo1' }, { name: 'repo1' }, { name: 'repo2' }],
      })
    ).toThrow('found some duplicates in your repositories');
  });

  it('should throw error when repository duplicates in project', () => {
    expect(() =>
      checkConfiguration({
        projects: [
          {
            name: 'my project',
            repositories: [
              { name: 'repo1', tag: 'v1' },
              { name: 'repo1', tag: 'v1' },
              { name: 'repo2', tag: 'v2' },
            ],
          },
        ],
        repositories: [{ name: 'repo1' }, { name: 'repo2' }],
      })
    ).toThrow(
      "found some duplicates in your repositories for project 'my project'"
    );
  });

  it('should throw error when unknown repository', () => {
    expect(() =>
      checkConfiguration({
        projects: [
          {
            name: 'my project',
            repositories: [
              { name: 'repo1', tag: 'v1' },
              { name: 'repo3', tag: 'v2' },
            ],
          },
        ],
        repositories: [{ name: 'repo1' }, { name: 'repo2' }],
      })
    ).toThrow("repository 'repo3' (in project: 'my project') not found");
  });

  it('should throw error when unused repository', () => {
    expect(() =>
      checkConfiguration({
        projects: [
          {
            name: 'my project',
            repositories: [
              { name: 'repo1', tag: 'v1' },
              { name: 'repo2', tag: 'v2' },
            ],
          },
        ],
        repositories: [{ name: 'repo1' }, { name: 'repo2' }, { name: 'repo3' }],
      })
    ).toThrow("repository 'repo3' not used in any project");
  });
});
