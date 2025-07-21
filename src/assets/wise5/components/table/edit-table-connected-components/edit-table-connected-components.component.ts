import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { EditConnectedComponentDefaultSelectsComponent } from '../../../../../app/authoring-tool/edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentDeleteButtonComponent } from '../../../../../app/authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';

@Component({
  selector: 'edit-table-connected-components',
  templateUrl: './edit-table-connected-components.component.html',
  styleUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
  imports: [
    CommonModule,
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentDefaultSelectsComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    MatOption,
    MatCheckbox,
    EditConnectedComponentDeleteButtonComponent
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
