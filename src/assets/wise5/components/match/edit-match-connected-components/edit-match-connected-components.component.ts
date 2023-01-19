import { Component } from '@angular/core';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { copy } from '../../../common/object/object';
import { ProjectService } from '../../../services/projectService';

@Component({
  selector: 'edit-match-connected-components',
  templateUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.html',
  styleUrls: [
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss'
  ]
})
export class EditMatchConnectedComponentsComponent extends EditConnectedComponentsComponent {
  constructor(protected ProjectService: ProjectService) {
    super(ProjectService);
  }

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
      const connectedComponentContent = copy(this.ProjectService.getComponent(nodeId, componentId));
      this.componentContent.choices = connectedComponentContent.choices;
      this.componentContent.buckets = connectedComponentContent.buckets;
      this.componentContent.feedback = connectedComponentContent.feedback;
      this.componentContent.ordered = connectedComponentContent.ordered;
      this.componentContent.canCreateChoices = connectedComponentContent.canCreateChoices;
      this.componentContent.importPrivateNotes = connectedComponentContent.importPrivateNotes;
    }
  }
}
