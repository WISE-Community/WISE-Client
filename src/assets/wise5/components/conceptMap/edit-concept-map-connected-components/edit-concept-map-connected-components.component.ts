import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { EditConnectedComponentDefaultSelectsComponent } from '../../../../../app/authoring-tool/edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentDeleteButtonComponent } from '../../../../../app/authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsWithBackgroundComponent } from '../../../../../app/authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';
import { ConceptMapContent } from '../ConceptMapContent';

@Component({
  selector: 'app-edit-concept-map-connected-components',
  templateUrl: './edit-concept-map-connected-components.component.html',
  styleUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
  imports: [
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentDefaultSelectsComponent,
    MatCheckbox,
    FormsModule,
    EditConnectedComponentDeleteButtonComponent
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

  afterComponentIdChanged(connectedComponent: any): void {
    super.afterComponentIdChanged(connectedComponent);
    if (this.connectedComponentTypeIsSpecificType(connectedComponent, 'ConceptMap')) {
      this.askIfWantToCopyNodesAndLinks(connectedComponent);
    }
  }

  askIfWantToCopyNodesAndLinks({ nodeId, componentId }): void {
    if (
      confirm(
        $localize`Do you want to copy the nodes and links from the connected activity?` +
          '\n\n' +
          $localize`Warning: This will delete all existing nodes and links in this activity.`
      )
    ) {
      const connectedComponent = this.projectService.getComponent(
        nodeId,
        componentId
      ) as ConceptMapContent;
      this.componentContent.nodes = connectedComponent.nodes;
      this.componentContent.links = connectedComponent.links;
      this.connectedComponentChanged();
    }
  }
}
