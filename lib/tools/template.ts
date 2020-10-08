import Mustache from 'mustache';

export function createTemplateEngine(): any {
  return {
    run,
  };

  async function run(data: any, template: any): Promise<string> {
    const html = Mustache.render(template, data);
    return html;
  }
}
