import { Component } from '@angular/core';
import { EditConnectedComponentsWithBackgroundComponent } from '../../../../../app/authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';

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

  afterComponentIdChanged(connectedComponent: any): void {
    super.afterComponentIdChanged(connectedComponent);
    this.setUpdateOnIfApplicable(connectedComponent);
  }

  setUpdateOnIfApplicable(connectedComponent: any) {
    if (connectedComponent.nodeId === this.nodeId) {
      connectedComponent.updateOn = 'submit';
    } else {
      delete connectedComponent.updateOn;
    }
  }
}
