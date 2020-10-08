import { GitTool, Git } from './types';

export interface GitCreation {
  git: GitTool;
}

export function createGit(creation: GitCreation): Git {
  const { git } = creation;

  return {
    clone,
    checkout,
  };

  async function clone(url: string, destDir: string): Promise<void> {
    await git.clone(url, destDir);
  }

  async function checkout(tag: string): Promise<void> {
    await git.checkout(tag);
  }
}
