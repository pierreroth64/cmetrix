import * as _ from 'lodash';

import {
  Logger,
  Shell,
  RunWithSpinner,
  ClonedRepository,
  Project,
  ProjectMetrics,
} from './types';

export interface CollectProjectsMetricsCreation {
  logger: Logger;
  shell: Shell;
  runWithSpinner: RunWithSpinner;
}

interface ClocOptions {
  languages?: string[];
  excludeDirs?: string[];
}

export function makeCollectProjectsMetrics(
  creation: CollectProjectsMetricsCreation
) {
  const { shell, logger, runWithSpinner } = creation;

  return async (
    projects: Project[],
    clonedRepos: ClonedRepository[]
  ): Promise<ProjectMetrics[]> => {
    try {
      const results = await runWithSpinner(
        runCollect,
        'collecting projects metrics...'
      );
      logger.info('collected projects metrics');
      return results;
    } catch (e) {
      logger.error(`error when collecting projects metrics: ${e.message}`);
      throw e;
    }

    async function runCollect(): Promise<ProjectMetrics[]> {
      return await Promise.all(
        projects.map((p) => collectSingleProjectMetrics(p, clonedRepos))
      );
    }
  };

  async function collectSingleProjectMetrics(
    project: Project,
    clonedRepos: ClonedRepository[]
  ): Promise<ProjectMetrics> {
    const { name: projectName, repositories } = project;

    const metrics: any[] = [];
    for (const repo of repositories) {
      const { name: repoName } = repo;
      const cloned = _.find(clonedRepos, { name: repoName });
      if (!cloned) {
        throw new Error(`cloned repository named '${repoName}' not found`);
      }
      const { languages, excludeDirs } = cloned;

      metrics.push({
        repoName,
        metrics: formatClocResult(
          await runCloc(cloned.dir, { languages, excludeDirs })
        ),
      });
    }

    return {
      projectName,
      projectId: _.kebabCase(projectName)
        .replace(/-+/gi, '')
        .replace(/\s+/gi, ''),
      metrics: {
        cumulated: computeCumulated(metrics),
        perRepos: metrics,
      },
    };

    async function runCloc(dir: string, options?: ClocOptions): Promise<any> {
      const { languages, excludeDirs } = _.defaults({}, options, {
        languages: [],
        excludeDirs: [],
      });

      const extraArgs: string[] = [];

      if (languages && languages.length) {
        extraArgs.push(`--include-lang=${languages.join(',')}`);
      }
      if (excludeDirs && excludeDirs.length) {
        extraArgs.push(`--exclude-dir=${excludeDirs.join(',')}`);
      }
      const args = ['.', '--json', ...extraArgs];

      logger.debug(`\nrunning command in dir ${dir}: cloc ${args.join(' ')}`);
      const { stdout: result } = await shell.run('cloc', args, {
        workingDirectory: dir,
      });
      return JSON.parse(result);
    }

    function formatClocResult(result: any): any {
      const formatted = Object.assign({}, result, { cumulated: result.SUM });
      delete formatted.SUM;
      return formatted;
    }
  }
}

function computeCumulated(metrics: any): any {
  return _.reduce(
    metrics,
    (acc, m) => {
      const {
        metrics: { cumulated },
      } = m;
      acc.blank += cumulated.blank;
      acc.comment += cumulated.comment;
      acc.code += cumulated.code;
      acc.nFiles += cumulated.nFiles;
      return acc;
    },
    {
      blank: 0,
      comment: 0,
      code: 0,
      nFiles: 0,
    }
  );
}
