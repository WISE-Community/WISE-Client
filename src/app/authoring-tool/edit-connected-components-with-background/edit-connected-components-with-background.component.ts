import { Component } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { EditConnectedComponentsComponent } from '../edit-connected-components/edit-connected-components.component';

@Component({
  selector: 'edit-connected-components-with-background',
  templateUrl: './edit-connected-components-with-background.component.html',
  styleUrls: [
    '../edit-connected-components/edit-connected-components.component.scss',
    './edit-connected-components-with-background.component.scss'
  ]
})
export class EditConnectedComponentsWithBackgroundComponent extends EditConnectedComponentsComponent {
  componentTypesThatCanImportWorkAsBackground: string[] = [];

  constructor(protected ProjectService: ProjectService) {
    super(ProjectService);
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
