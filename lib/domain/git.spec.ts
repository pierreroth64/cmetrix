import { createGitMock } from '../tests';

import { createGit } from './git';

describe('git facade', () => {
  let git: any;
  let gitTool: any;
  let createGitTool: any;

  beforeEach(() => {
    createGitTool = (): any => {
      gitTool = createGitMock();
      return gitTool;
    };
  });

  it('should encode github token', async () => {
    git = createGit({ createGitTool, githubToken: 'githubToken123' });

    await git.clone('https://github.com/me/my-repos.git', 'destDir');

    expect(gitTool.clone).toHaveBeenCalledWith(
      'https://githubToken123:x-oauth-basic@github.com/me/my-repos.git',
      'destDir'
    );
  });

  it('should encode gitlab token', async () => {
    git = createGit({ createGitTool, gitlabToken: 'gitlabToken456' });

    await git.clone('https://gitlab.com/me/my-repos.git', 'destDir');

    expect(gitTool.clone).toHaveBeenCalledWith(
      'https://oauth2:gitlabToken456@gitlab.com/me/my-repos.git',
      'destDir'
    );
  });

  it('should encode bitbucket token', async () => {
    git = createGit({ createGitTool, bitbucketToken: 'bitbucketToken789' });

    await git.clone('https://bitbucket.com/me/my-repos.git', 'destDir');

    expect(gitTool.clone).toHaveBeenCalledWith(
      'https://username::bitbucketToken789@bitbucket.com/me/my-repos.git',
      'destDir'
    );
  });
});
