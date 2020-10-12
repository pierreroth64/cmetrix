import simpleGit from 'simple-git';
import { Level as LogLevel } from '@arpinum/log';

import {
  makeCheckConfiguration,
  createGit,
  makeBuildProjectMetrics,
  makeAnalyzeRepos,
  makeGenerateOutput,
} from '../domain';

import {
  createLogger,
  FileOps as fileOps,
  createShell,
  createTemplateEngine,
  createProgress as rawCreateProgress,
} from '../tools';

export function bootstrap(options: any): any {
  const logLevel = options.quiet ? LogLevel.off : options.logLevel;
  const silent = options.quiet || logLevel !== LogLevel.off;
  const createProgress = (title: string, total: number) =>
    rawCreateProgress({ title, total, silent });
  const logger = createLogger({
    level: logLevel,
  });
  const git = createGit({
    createGitTool: (workDir?: string) => simpleGit(workDir),
    githubToken: process.env.CMETRIX_GITHUB_TOKEN,
    gitlabToken: process.env.CMETRIX_GITLAB_TOKEN,
    bitbucketToken: process.env.CMETRIX_BITBUCKET_TOKEN,
  });
  const shell = createShell({ logger });
  const templateEngine = createTemplateEngine();

  const checkConfiguration = makeCheckConfiguration({
    logger,
  });
  const buildProjectMetrics = makeBuildProjectMetrics({
    logger,
  });

  const analyzeRepos = makeAnalyzeRepos({
    git,
    logger,
    fileOps,
    shell,
  });

  const generateOutput = makeGenerateOutput({
    fileOps,
    logger,
    templateEngine,
    title: options.title,
    format: options.format,
    outDir: options.outDir,
  });

  return {
    logger,
    fileOps,
    createProgress,
    buildProjectMetrics,
    checkConfiguration,
    generateOutput,
    analyzeRepos,
  };
}
