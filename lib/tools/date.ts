import moment from 'moment';

import { Logger } from '../domain';

export interface GetCurrentDateCreation {
  logger: Logger;
}

export function makeGetCurrentDate(creation: GetCurrentDateCreation) {
  const { logger } = creation;

  return function getCurrentDate(): string {
    return moment().locale(getLocale()).format('LLLL');

    function getLocale(): string {
      const env = process.env;
      const locale =
        env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || 'en';
      logger.debug(`locale is: ${locale}`);
      return locale;
    }
  };
}
