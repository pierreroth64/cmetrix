import * as _ from 'lodash';

import { Logger, Project, ProjectMetrics, RepositoryMetrics } from './types';

export interface CollectProjectMetricsCreation {
  logger: Logger;
}

export function makeBuildProjectMetrics(
  creation: CollectProjectMetricsCreation
) {
  const { logger } = creation;

  return (
    project: Project,
    reposMetrics: RepositoryMetrics[]
  ): ProjectMetrics => {
    try {
      const { name } = project;
      const results = buildSingleProjectMetrics(project, reposMetrics);
      logger.info(`built project metrics for ${name}`);
      return results;
    } catch (e) {
      logger.error(`error when collecting project metrics: ${e.message}`);
      throw e;
    }
  };

  function buildSingleProjectMetrics(
    project: Project,
    reposMetrics: RepositoryMetrics[]
  ): ProjectMetrics {
    const { name: projectName, repositories } = project;

    const metrics: any[] = [];
    for (const repo of repositories) {
      const { name: repoName } = repo;
      logger.debug(
        `finding metrics for repo with name: ${repoName} in:`,
        reposMetrics
      );
      const singleRepoMetrics = _.find(reposMetrics, { name: repoName });
      if (!singleRepoMetrics) {
        throw new Error(`metrics for repository named '${repoName}' not found`);
      }
      metrics.push({
        repoName,
        metrics: singleRepoMetrics.metrics,
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
