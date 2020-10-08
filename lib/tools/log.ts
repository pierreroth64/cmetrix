import chalk from 'chalk';
import { createLogger as baseCreateLogger, Level } from '@arpinum/log';

const error = chalk.bold.red;
const info = chalk.cyan;
const success = chalk.green;
const warning = chalk.yellow;

interface Creation {
  level: Level;
}

export function createLogger(creation: Creation) {
  return baseCreateLogger({
    level: creation.level,
    getLogInputs: ({ level, args }) => {
      if (level === Level.error) {
        return [error('\u2022', ...args, '\u274C')];
      }
      if (level === Level.info) {
        return [info('\u2022', ...args)];
      }
      if (level === Level.warn) {
        return [warning('\u2022', ...args)];
      }
      return args;
    },
  });
}

export function createSuccessLog(...args: any[]) {
  return success(...args, '\u2714');
}
