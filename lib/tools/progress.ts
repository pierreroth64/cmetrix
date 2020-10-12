import ProgressBar from 'progress';

interface TerminalProgressCreation {
  title: string;
  silent?: boolean;
  total: number;
}

export function createProgress(creation: TerminalProgressCreation): any {
  const { total, silent, title } = creation;
  return silent ? createSilentProgress() : createLiveProgress();

  function createLiveProgress(): any {
    const bar: any = new ProgressBar(`${title} :current/:total [:bar]`, {
      total,
      clear: true,
    });

    return {
      update,
    };

    async function update() {
      bar.tick();
    }
  }

  function createSilentProgress(): any {
    return {
      update,
    };

    async function update() {}
  }
}
