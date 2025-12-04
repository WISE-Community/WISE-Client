import { Component } from '@angular/core';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { copy } from '../../../common/object/object';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentDefaultSelectsComponent } from '../../../../../app/authoring-tool/edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentDeleteButtonComponent } from '../../../../../app/authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';

@Component({
  selector: 'edit-match-connected-components',
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
export class EditMatchConnectedComponentsComponent extends EditConnectedComponentsComponent {

  afterComponentIdChanged(connectedComponent: any): void {
    if (this.connectedComponentTypeIsSpecificType(connectedComponent, 'Match')) {
      this.askIfWantToCopyChoicesAndBuckets(connectedComponent);
    }
  }

  askIfWantToCopyChoicesAndBuckets({ nodeId, componentId }): void {
    if (
      confirm(
        $localize`Do you want to copy the choices and buckets from the connected component?\n\nWarning: This will delete all existing choices and buckets in this component.`
      )
    ) {
      const connectedComponentContent = copy(this.projectService.getComponent(nodeId, componentId));
      this.componentContent.choices = connectedComponentContent.choices;
      this.componentContent.buckets = connectedComponentContent.buckets;
      this.componentContent.feedback = connectedComponentContent.feedback;
      this.componentContent.ordered = connectedComponentContent.ordered;
      this.componentContent.canCreateChoices = connectedComponentContent.canCreateChoices;
      this.componentContent.importPrivateNotes = connectedComponentContent.importPrivateNotes;
    }
  }
}
