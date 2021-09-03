import { Component } from '@angular/core';
import { EditConnectedComponentsWithBackgroundComponent } from '../../../../../app/authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';
import { ProjectService } from '../../../services/projectService';

@Component({
  selector: 'edit-draw-connected-components',
  templateUrl: './edit-draw-connected-components.component.html',
  styleUrls: [
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
    './edit-draw-connected-components.component.scss'
  ]
})
export class EditDrawConnectedComponentsComponent extends EditConnectedComponentsWithBackgroundComponent {
  componentTypesThatCanImportWorkAsBackground: string[] = [
    'ConceptMap',
    'Embedded',
    'Graph',
    'Label',
    'Table'
  ];

  constructor(protected ProjectService: ProjectService) {
    super(ProjectService);
  }

  ngOnInit(): void {}

  afterComponentIdChanged(connectedComponent: any): void {
    super.afterComponentIdChanged(connectedComponent);
    if (connectedComponent.nodeId !== this.nodeId) {
      delete connectedComponent.updateOn;
    }
  }
}
