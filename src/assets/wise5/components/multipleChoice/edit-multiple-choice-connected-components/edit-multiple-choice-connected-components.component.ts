import { Component } from '@angular/core';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { ProjectService } from '../../../services/projectService';
import { UtilService } from '../../../services/utilService';
import { MultipleChoiceContent } from '../MultipleChoiceContent';

@Component({
  selector: 'edit-multiple-choice-connected-components',
  templateUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.html',
  styleUrls: [
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss'
  ]
})
export class EditMultipleChoiceConnectedComponentsComponent extends EditConnectedComponentsComponent {
  constructor(protected ProjectService: ProjectService, private UtilService: UtilService) {
    super(ProjectService);
  }

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
    const component = this.ProjectService.getComponent(nodeId, componentId);
    this.componentContent.choiceType = (component as MultipleChoiceContent).choiceType;
  }

  copyChoicesFromComponent(nodeId: string, componentId: string): void {
    this.componentContent.choices = this.getCopyOfChoicesFromComponent(nodeId, componentId);
  }

  getCopyOfChoicesFromComponent(nodeId: string, componentId: string): void {
    const component = this.ProjectService.getComponent(nodeId, componentId);
    return this.UtilService.makeCopyOfJSONObject((component as MultipleChoiceContent).choices);
  }
}
