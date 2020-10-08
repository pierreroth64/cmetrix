import simpleGit from 'simple-git';
import { Level as LogLevel } from '@arpinum/log';

import {
  makeCheckConfiguration,
  createGit,
  makeCollectProjectsMetrics,
  makeCloneRepos,
  makeRemoveTemporaryLocalRepos,
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
  const logger = createLogger({
    level: options.quiet ? LogLevel.off : options.logLevel,
  });
  const git = createGit({ git: simpleGit() });
  const shell = createShell({ logger });
  const spinner = createSpinner({ silent: options.quiet });
  const templateEngine = createTemplateEngine();

  const runWithSpinner = makeRunWithSpinner(spinner);
  const checkConfiguration = makeCheckConfiguration({
    logger,
  });
  const cloneRepos = makeCloneRepos({ git, fileOps, logger, runWithSpinner });
  const removeTemporaryLocalRepos = makeRemoveTemporaryLocalRepos({
    logger,
    fileOps,
    runWithSpinner,
  });
  const collectProjectsMetrics = makeCollectProjectsMetrics({
    logger,
    shell,
    runWithSpinner,
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
    cloneRepos,
    removeTemporaryLocalRepos,
    collectProjectsMetrics,
    checkConfiguration,
    generateOutput,
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
