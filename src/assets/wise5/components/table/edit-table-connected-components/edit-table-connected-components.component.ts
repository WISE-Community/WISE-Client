import { Component } from '@angular/core';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';

@Component({
  selector: 'edit-table-connected-components',
  templateUrl: './edit-table-connected-components.component.html',
  styleUrls: [
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
    './edit-table-connected-components.component.scss'
  ]
})
export class EditTableConnectedComponentsComponent extends EditConnectedComponentsComponent {
  afterComponentIdChanged(connectedComponent: any) {
    const connectedComponentType = this.getConnectedComponentType(connectedComponent);
    if (connectedComponentType !== 'Graph') {
      delete connectedComponent.showDataAtMouseX;
    }
  }
}
