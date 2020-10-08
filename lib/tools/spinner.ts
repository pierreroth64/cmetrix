import ora from 'ora';

interface TerminalSpinnerCreation {
  silent?: boolean;
}

export function createSpinner(creation?: TerminalSpinnerCreation): any {
  if (creation && creation.silent) {
    return createSilentSpinner();
  }
  return createRotatingSpinner();
}

export function createRotatingSpinner(): any {
  let spinner: any;

  return {
    start,
    stop,
  };

  async function start(message: string) {
    spinner = ora(message);
    spinner.start();
  }

  async function stop() {
    if (spinner) {
      spinner.stop();
    }
  }
}

function createSilentSpinner(): any {
  return {
    start,
    stop,
  };

  async function start(_: string) {}

  async function stop() {}
}
