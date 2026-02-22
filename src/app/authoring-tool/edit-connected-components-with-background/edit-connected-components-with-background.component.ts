import { Component } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { EditConnectedComponentsComponent } from '../edit-connected-components/edit-connected-components.component';

@Component({
  template: ''
})
export class EditConnectedComponentsWithBackgroundComponent extends EditConnectedComponentsComponent {
  componentTypesThatCanImportWorkAsBackground: string[] = [];

  constructor(protected projectService: ProjectService) {
    super(projectService);
  }

  canConnectedComponentTypeImportWorkAsBackground(connectedComponent: any): boolean {
    return this.componentTypesThatCanImportWorkAsBackground.includes(
      this.getConnectedComponentType(connectedComponent)
    );
  }

  afterComponentIdChanged(connectedComponent: any): void {
    if (this.canConnectedComponentTypeImportWorkAsBackground(connectedComponent)) {
      connectedComponent.importWorkAsBackground = true;
    } else {
      delete connectedComponent.importWorkAsBackground;
    }
  }
}
