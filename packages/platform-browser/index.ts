import { InDiv } from '@indiv/core';
import { render } from './render';

export { Compile, CompileUtilForRepeat, CompileUtil } from './compile';
export { render } from './render';

export class PlatformBrowser {
  public bootstrap(indivInstance: InDiv): void {
    indivInstance.setComponentRender(render);
  }
}
