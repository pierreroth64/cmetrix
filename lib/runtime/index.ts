import simpleGit from 'simple-git';
import { Level as LogLevel } from '@arpinum/log';

import {
  makeCheckConfiguration,
  createGit,
  makeBuildProjectMetrics,
  makeAnalyzeRepos,
  makeGenerateOutput,
  RunWithSpinner,
  ToBeRun,
  Spinner,
} from '../domain';

import {
  createLogger,
  FileOps as fileOps,
  createShell,
  createSpinner,
  createTemplateEngine,
} from '../tools';

export function bootstrap(options: any): any {
  const logLevel = options.quiet ? LogLevel.off : options.logLevel;
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
  const spinner = createSpinner({ silent: options.quiet });
  const templateEngine = createTemplateEngine();

  const runWithSpinner =
    logLevel == LogLevel.off
      ? makeRunWithSpinner(spinner)
      : async (x: any) => await x();
  const checkConfiguration = makeCheckConfiguration({
    logger,
  });
  const buildProjectMetrics = makeBuildProjectMetrics({
    logger,
  });

  const analyzeRepos = makeAnalyzeRepos({
    git,
    logger,
    runWithSpinner,
    fileOps,
    shell,
  });

  const generateOutput = makeGenerateOutput({
    fileOps,
    runWithSpinner,
    logger,
    templateEngine,
    title: options.title,
    format: options.format,
    outDir: options.outDir,
  });

  return {
    runWithSpinner,
    fileOps,
    buildProjectMetrics,
    checkConfiguration,
    generateOutput,
    analyzeRepos,
  };
}

function makeRunWithSpinner(spinner: Spinner): RunWithSpinner {
  return async (run: ToBeRun, message: string): Promise<any> => {
    try {
      await spinner.start(message);
      return await run();
    } finally {
      await spinner.stop();
    }
  };
}
