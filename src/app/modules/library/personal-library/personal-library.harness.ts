import { ComponentHarness } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { LibraryProjectHarness } from '../library-project/library-project.harness';
import { MatButtonHarness } from '@angular/material/button/testing';
import { SelectAllProjectsCheckboxHarness } from '../select-all-projects-checkbox/select-all-projects-checkbox.harness';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';

export class PersonalLibraryHarness extends ComponentHarness {
  static hostSelector = 'app-personal-library';
  protected getViewSelect = this.locatorFor(MatSelectHarness);
  getArchiveButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[aria-label="Archive selected units"]' })
  );
  getUnarchiveButton = this.locatorFor(
    MatButtonHarness.with({ selector: '[aria-label="Restore selected units"]' })
  );
  getPaginator = this.locatorFor(MatPaginatorHarness);

  async getSelectAllCheckbox(): Promise<MatCheckboxHarness> {
    return (await this.locatorFor(SelectAllProjectsCheckboxHarness)()).getCheckbox();
  }

  async getProjectsInView(): Promise<LibraryProjectHarness[]> {
    const projects = this.locatorForAll(LibraryProjectHarness);
    return await projects();
  }

  async getProjectIdsInView(): Promise<number[]> {
    const projectIds = [];
    for (const project of await this.getProjectsInView()) {
      projectIds.push(await project.getProjectId());
    }
    return projectIds;
  }

  async selectProjects(projectIds: number[]): Promise<void> {
    for (const project of await this.getProjectsInView()) {
      if (projectIds.includes(await project.getProjectId())) {
        await (await project.getCheckbox()).check();
      }
    }
  }

  async getProjectCount(): Promise<number> {
    const projects = this.locatorForAll('app-library-project');
    return (await projects()).length;
  }

  async showArchivedView(): Promise<void> {
    return (await this.getViewSelect()).clickOptions({ text: 'Archived' });
  }

  async showActiveView(): Promise<void> {
    return (await this.getViewSelect()).clickOptions({ text: 'Active' });
  }

  async getSelectedProjects(): Promise<LibraryProjectHarness[]> {
    const selectedProjects = [];
    for (const project of await this.getProjectsInView()) {
      if (await (await project.getCheckbox()).isChecked()) {
        selectedProjects.push(project);
      }
    }
    return selectedProjects;
  }

  async getSelectedProjectIds(): Promise<number[]> {
    const selectedProjectIds = [];
    for (const project of await this.getSelectedProjects()) {
      selectedProjectIds.push(await project.getProjectId());
    }
    return selectedProjectIds;
  }
}
