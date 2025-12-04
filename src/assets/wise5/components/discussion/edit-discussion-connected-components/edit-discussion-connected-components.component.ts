import { Component } from '@angular/core';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentDefaultSelectsComponent } from '../../../../../app/authoring-tool/edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentDeleteButtonComponent } from '../../../../../app/authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';

@Component({
  selector: 'edit-discussion-connected-components',
  templateUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.html',
  styleUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
  imports: [
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentDefaultSelectsComponent,
    EditConnectedComponentDeleteButtonComponent
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
