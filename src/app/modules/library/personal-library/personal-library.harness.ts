import { ComponentHarness } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { LibraryProjectHarness } from '../library-project/library-project.harness';

export class PersonalLibraryHarness extends ComponentHarness {
  static hostSelector = 'app-personal-library';
  protected getViewSelect = this.locatorFor(MatSelectHarness);

  async getProjects(): Promise<LibraryProjectHarness[]> {
    const projects = this.locatorForAll(LibraryProjectHarness);
    return await projects();
  }

  async getProjectCount(): Promise<number> {
    const projects = this.locatorForAll('app-library-project');
    return (await projects()).length;
  }

  async showArchived(): Promise<void> {
    return (await this.getViewSelect()).clickOptions({ text: 'Archived' });
  }
}
