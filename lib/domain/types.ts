export interface Git {
  clone: (url: string, destDir: string) => Promise<void>;
  checkout: (tag: string) => Promise<any>;
}

export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export interface GitTool {
  clone: (repoPath: string, localPath: string) => Promise<any>;
  checkout: (tag: string) => Promise<any>;
}

export interface FileOps {
  createTemporaryDirectory: (prefix?: string) => Promise<string>;
  remove: (path: string) => Promise<any>;
  doesExist: (path: string) => Promise<boolean>;
  readText: (path: string) => Promise<string>;
  writeText: (path: string, text: string) => Promise<void>;
}

export interface ShellOptions {
  workingDirectory?: string;
}

export interface Shell {
  run: (
    command: string,
    args: any[],
    options?: ShellOptions
  ) => Promise<{ stdout: string; stderr: string }>;
  cd: (path: string) => Promise<void>;
}

export interface Spinner {
  start: (msg: string) => Promise<void>;
  stop: () => Promise<void>;
}

export interface Project {
  name: string;
  repositories: Repository[];
}

export interface Cloned {
  dir: string;
  toBeRemoved: boolean;
}

export interface Repository {
  name: string;
  url: string;
  languages?: string[];
  excludeDirs?: string[];
}

export type ClonedRepository = Repository & Cloned;

export type ToBeRun = (...args: any) => Promise<any>;
export type RunWithSpinner = (run: ToBeRun, message: string) => Promise<any>;

export interface ProjectMetrics {
  projectName: string;
  projectId: string;
  metrics: {
    cumulated: {
      blank: number;
      comment: number;
      code: number;
      nFiles: number;
    };
    perRepos: any[];
  };
}

export enum OutputFormat {
  json = 'json',
  html = 'html',
}

export interface TemplateEngine {
  run: (data: any, template: any) => Promise<string>;
}
