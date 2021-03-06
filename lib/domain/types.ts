export interface Git {
  clone: (url: string, destDir: string) => Promise<void>;
  checkout: (tag: string, workingDirectory: string) => Promise<any>;
}

export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export type GitToolFactoryFunction = (workingDirectory?: string) => any;

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
  tag?: string;
}

export type ClonedRepository = Repository & Cloned;

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
    perRepos: RepositoryMetrics[];
  };
}

export interface RepositoryMetrics {
  name: string;
  metrics: any;
  repository: ClonedRepository;
}

export enum OutputFormat {
  json = 'json',
  html = 'html',
}

export interface TemplateEngine {
  run: (data: any, template: any) => Promise<string>;
}
