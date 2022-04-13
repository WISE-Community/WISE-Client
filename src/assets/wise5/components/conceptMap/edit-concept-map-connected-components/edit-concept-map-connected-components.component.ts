import { Component } from '@angular/core';
import { ProjectService } from '../../../services/projectService';
import { EditConnectedComponentsWithBackgroundComponent } from '../../../../../app/authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';

@Component({
  selector: 'app-edit-concept-map-connected-components',
  templateUrl: './edit-concept-map-connected-components.component.html',
  styleUrls: [
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
    './edit-concept-map-connected-components.component.scss'
  ]
})
export class EditConceptMapConnectedComponentsComponent extends EditConnectedComponentsWithBackgroundComponent {
  componentTypesThatCanImportWorkAsBackground: string[] = [
    'Draw',
    'Embedded',
    'Graph',
    'Label',
    'Table'
  ];

  constructor(protected ProjectService: ProjectService) {
    super(ProjectService);
  }

  afterComponentIdChanged(connectedComponent: any): void {
    super.afterComponentIdChanged(connectedComponent);
    if (this.connectedComponentTypeIsSpecificType(connectedComponent, 'ConceptMap')) {
      this.askIfWantToCopyNodesAndLinks(connectedComponent);
    }
  }

  askIfWantToCopyNodesAndLinks({ nodeId, componentId }): void {
    if (
      confirm(
        $localize`Do you want to copy the nodes and links from the connected component?` +
          '\n\n' +
          $localize`Warning: This will delete all existing nodes and links in this component.`
      )
    ) {
      const connectedComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(
        nodeId,
        componentId
      );
      this.componentContent.nodes = connectedComponentContent.nodes;
      this.componentContent.links = connectedComponentContent.links;
      this.connectedComponentChanged();
    }
  }
}
