import { Component } from '@angular/core';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { copy } from '../../../common/object/object';
import { MultipleChoiceContent } from '../MultipleChoiceContent';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentDefaultSelectsComponent } from '../../../../../app/authoring-tool/edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentDeleteButtonComponent } from '../../../../../app/authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';

@Component({
  selector: 'edit-multiple-choice-connected-components',
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
export class EditMultipleChoiceConnectedComponentsComponent extends EditConnectedComponentsComponent {

  afterComponentIdChanged(connectedComponent: any): void {
    if (this.connectedComponentTypeIsSpecificType(connectedComponent, 'MultipleChoice')) {
      this.askIfWantToCopyChoices(connectedComponent);
    }
  }

  askIfWantToCopyChoices({ nodeId, componentId }): void {
    if (
      confirm(
        $localize`Do you want to copy the choices from the connected component?\n\nWarning: This will delete all existing choices in this component.`
      )
    ) {
      this.copyChoiceTypeFromComponent(nodeId, componentId);
      this.copyChoicesFromComponent(nodeId, componentId);
    }
  }

  copyChoiceTypeFromComponent(nodeId: string, componentId: string): void {
    const component = this.projectService.getComponent(nodeId, componentId);
    this.componentContent.choiceType = (component as MultipleChoiceContent).choiceType;
  }

  copyChoicesFromComponent(nodeId: string, componentId: string): void {
    this.componentContent.choices = this.getCopyOfChoicesFromComponent(nodeId, componentId);
  }

  getCopyOfChoicesFromComponent(nodeId: string, componentId: string): void {
    const component = this.projectService.getComponent(nodeId, componentId);
    return copy((component as MultipleChoiceContent).choices);
  }
}
