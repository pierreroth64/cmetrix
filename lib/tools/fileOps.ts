import mkdirp from 'mkdirp';
import glob from 'glob';
import { access, constants, mkdtemp, readFile, writeFile } from 'fs';
import { join as joinPath } from 'path';
import rimraf from 'rimraf';
import { promisify } from 'util';
import { tmpdir } from 'os';

const mkdtempAsync = promisify(mkdtemp);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const accessAsync = promisify(access);
const globAsync = promisify(glob);
const rimrafAsync = promisify(rimraf);

function createDirectory(path: string): Promise<void> {
  return mkdirp(path).then(() => undefined);
}

function createTemporaryDirectory(
  prefix: string = 'cmetrix-'
): Promise<string> {
  return mkdtempAsync(joinPath(tmpdir(), prefix));
}

function find(pattern: string, workingDirectory: string): Promise<string[]> {
  return globAsync(pattern, {
    absolute: true,
    cwd: workingDirectory,
  });
}

function readJson(path: string): Promise<any> {
  return readText(path).then(JSON.parse);
}

function readText(path: string): Promise<string> {
  return readFileAsync(path, { encoding: 'utf-8' });
}

function writeText(path: string, text: string): Promise<void> {
  return writeFileAsync(path, text);
}

function remove(path: string) {
  return rimrafAsync(path);
}

function doesExist(path: string): Promise<boolean> {
  return accessAsync(path, constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

export const FileOps = {
  createDirectory,
  createTemporaryDirectory,
  find,
  readJson,
  readText,
  writeText,
  remove,
  doesExist,
};
