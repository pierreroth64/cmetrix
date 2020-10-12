import program from 'commander';
import open from 'open';
import { tmpdir } from 'os';

import { bootstrap } from './runtime';
import { Level as LogLevel } from '@arpinum/log';
import { ClonedRepository, OutputFormat } from './domain';

program
  .command('charts')
  .requiredOption(
    '-c, --configuration-file [CONF_FILE]',
    '[CONF_FILE] where repositories and projects to parse are described',
    undefined
  )
  .option(
    '-q, --quiet',
    'when set, no intermediate messages (such as spinners). Results only',
    false
  )
  .option(
    '-f, --format [FORMAT]',
    'FORMAT is the expected output format',
    OutputFormat.html
  )
  .option(
    '-t, --title [TITLE]',
    'TITLE is the title of the generated output',
    'Code Metrics'
  )
  .requiredOption(
    '-o, --out-dir [OUT_DIR]',
    '[OUT_DIR] where to generate artefacts',
    tmpdir()
  )
  .option('--open', 'when set, open generated output file', false)
  .option(
    '-l, --log-level [LOG_LEVEL]',
    'LOG_LEVEL is the log level for console messages during execution',
    LogLevel.off
  )
  .action(async (options: any) => {
    let error: any = null;
    let cloned: ClonedRepository[] = [];
    const {
      checkConfiguration,
      fileOps,
      checkoutRepos,
      cloneRepos,
      removeTemporaryLocalRepos,
      collectProjectsMetrics,
      generateOutput,
    } = bootstrap(options);

    try {
      const conf = await checkConfiguration(
        await fileOps.readJson(options.configurationFile)
      );
      cloned = await cloneRepos(conf.repositories);
      await checkoutRepos(cloned);
      const projectsMetrics = await collectProjectsMetrics(
        conf.projects,
        cloned
      );
      const output = await generateOutput(projectsMetrics);
      console.log('generated:', output);
      if (options.open) {
        open(output);
      }
    } catch (e) {
      error = e;
    } finally {
      await removeTemporaryLocalRepos(cloned);
      if (error) {
        console.error(error);
        process.exit(1);
      }
      process.exit(0);
    }
  })
  .version(require('../package.json').version);

program.parse(process.argv);
