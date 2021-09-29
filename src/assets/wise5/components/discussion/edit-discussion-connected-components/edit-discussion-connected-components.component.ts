import { Component } from '@angular/core';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';

@Component({
  selector: 'edit-discussion-connected-components',
  templateUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.html',
  styleUrls: [
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss'
  ]
})
export class EditDiscussionConnectedComponentsComponent extends EditConnectedComponentsComponent {
  connectedComponentTypeChanged(connectedComponent: any) {
    this.changeAllDiscussionConnectedComponentTypesToMatch(connectedComponent.type);
    super.connectedComponentTypeChanged(connectedComponent);
  }

  changeAllDiscussionConnectedComponentTypesToMatch(connectedComponentType: string) {
    for (const connectedComponent of this.connectedComponents) {
      connectedComponent.type = connectedComponentType;
    }
  }
}
