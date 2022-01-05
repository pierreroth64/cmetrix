import { Logger } from './types';
import * as _ from 'lodash';

interface CheckConfigurationCreation {
  logger: Logger;
}

export function makeCheckConfiguration(creation: CheckConfigurationCreation) {
  const { logger } = creation;

  return (content: any): void => {
    logger.debug(`checking configuration...`);
    try {
      checkRepositoryDuplicates(content);
      checkRepositoryDuplicatesForProjects(content);
      checkUnknownRepositories(content);
      checkUnusedRepositories(content);
      logger.info(`configuration checked`);
      return content;
    } catch (e) {
      logger.warn(`configuration error: ${(e as Error).message}`);
      throw e;
    }
  };

  function checkRepositoryDuplicates(content: any) {
    logger.debug(`checking repository duplicates...`);

    const { repositories } = content;
    const uniques = _.uniqBy(repositories, 'name');
    if (uniques.length !== repositories.length) {
      throw new Error(`found some duplicates in your repositories`);
    }
  }

  function checkRepositoryDuplicatesForProjects(content: any) {
    logger.debug(`checking repository duplicates for projects...`);
    const { projects } = content;
    for (const project of projects) {
      const { name, repositories } = project;
      if (repositories.length !== _.uniqBy(repositories, 'name').length) {
        throw new Error(
          `found some duplicates in your repositories for project '${name}'`
        );
      }
    }
  }

  function checkUnknownRepositories(content: any) {
    const { repositories, projects } = content;
    const availableRepoNames = repositories.map((repo: any) => repo.name);

    for (const { name: projName } of projects) {
      checkProjectRepositories(projName, availableRepoNames);
    }

    function checkProjectRepositories(name: string, repos: string[]) {
      logger.debug(`checking project '${name}' repositories...`);

      const projectRepoNames: string[] = _.find(projects, {
        name,
      }).repositories.map((r: any) => r.name);

      for (const projRepoName of projectRepoNames) {
        if (!repos.includes(projRepoName)) {
          throw new Error(
            `repository '${projRepoName}' (in project: '${name}') not found`
          );
        }
      }
    }
  }

  function checkUnusedRepositories(content: any) {
    logger.debug(`checking unused repositories...`);

    const projectRepos: string[] = _.flatMap(
      content.projects.map((p: any) => p.repositories.map((r: any) => r.name))
    );
    const availableRepos = content.repositories.map((r: any) => r.name);

    const unusedRepos = _.without(availableRepos, ...projectRepos);

    if (unusedRepos.length) {
      throw new Error(
        `repository '${unusedRepos[0]}' not used in any project"`
      );
    }
  }
}
