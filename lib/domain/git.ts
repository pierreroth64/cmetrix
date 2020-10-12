import { GitTool, Git } from './types';

export interface GitCreation {
  git: GitTool;
  githubToken?: string;
  gitlabToken?: string;
  bitbucketToken?: string;
}

export function createGit(creation: GitCreation): Git {
  const { git, githubToken, gitlabToken, bitbucketToken } = creation;

  return {
    clone,
    checkout,
  };

  async function clone(url: string, destDir: string): Promise<void> {
    await git.clone(encodeWithTokenMaybe(url), destDir);
  }

  async function checkout(tag: string): Promise<void> {
    await git.checkout(tag);
  }

  function encodeWithTokenMaybe(url: string): string {
    if (githubToken && /https:\/\/.*github/.test(url)) {
      return url.replace(
        /https:\/\//gi,
        `https://${githubToken}:x-oauth-basic@`
      );
    }
    if (bitbucketToken && /https:\/\/.*bitbucket/.test(url)) {
      return url.replace(
        /https:\/\//gi,
        `https://username::${bitbucketToken}@`
      );
    }
    if (gitlabToken && /https:\/\/.*gitlab/.test(url)) {
      return url.replace(/https:\/\//gi, `https://oauth2:${gitlabToken}@`);
    }
    return url;
  }
}
