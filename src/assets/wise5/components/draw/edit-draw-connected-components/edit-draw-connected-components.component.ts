import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditConnectedComponentDefaultSelectsComponent } from '../../../../../app/authoring-tool/edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentDeleteButtonComponent } from '../../../../../app/authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsWithBackgroundComponent } from '../../../../../app/authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';

@Component({
  selector: 'edit-draw-connected-components',
  templateUrl: './edit-draw-connected-components.component.html',
  styleUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
  imports: [
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentDefaultSelectsComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatCheckbox,
    EditConnectedComponentDeleteButtonComponent
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
