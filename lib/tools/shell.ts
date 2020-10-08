import { spawn } from 'cross-spawn';
import * as shelljs from 'shelljs';

import { Logger } from '../domain';

export interface ShellCreation {
  logger: Logger;
}

export interface StandardOptions {
  workingDirectory?: string;
}

export function createShell(creation: ShellCreation): any {
  const { logger } = creation;

  return {
    run,
    cd,
  };

  async function run(
    command: string,
    args: any[],
    options: StandardOptions = {}
  ): Promise<{ stdout: string; stderr: string }> {
    const { workingDirectory } = options;
    let stdout = '';
    let stderr = '';
    return new Promise((resolve, reject) => {
      const childProcess = spawn(command, args, {
        cwd: workingDirectory,
      });
      childProcess.stdout.on('data', (data) => {
        stdout += data;
      });
      childProcess.stderr.on('data', (data) => {
        stderr += data;
      });
      childProcess.on('error', reject);
      childProcess.on('close', (code) => {
        if (code !== 0) {
          const message = `Unexpected return code ${code} for command ${command} with args ${args}`;
          logger.error(message);
          reject(new Error(message));
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async function cd(path: string) {
    shelljs.cd(path);
  }
}
