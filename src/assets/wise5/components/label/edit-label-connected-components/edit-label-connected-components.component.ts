import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { EditConnectedComponentDefaultSelectsComponent } from '../../../../../app/authoring-tool/edit-connected-component-default-selects/edit-connected-component-default-selects.component';
import { EditConnectedComponentDeleteButtonComponent } from '../../../../../app/authoring-tool/edit-connected-component-delete-button/edit-connected-component-delete-button.component';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsWithBackgroundComponent } from '../../../../../app/authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';

@Component({
  selector: 'edit-label-connected-components',
  templateUrl: './edit-label-connected-components.component.html',
  styleUrl:
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
  imports: [
    EditConnectedComponentsAddButtonComponent,
    EditConnectedComponentDefaultSelectsComponent,
    MatCheckbox,
    FormsModule,
    MatFormFieldModule,
    MatInput,
    EditConnectedComponentDeleteButtonComponent
  ]
})
export class EditLabelConnectedComponentsComponent extends EditConnectedComponentsWithBackgroundComponent {
  componentTypesThatCanImportWorkAsBackground: string[] = [
    'ConceptMap',
    'Draw',
    'Embedded',
    'Graph',
    'OpenResponse',
    'Table'
  ];

  afterComponentIdChanged(connectedComponent: any) {
    super.afterComponentIdChanged(connectedComponent);
    const connectedComponentType = this.getConnectedComponentType(connectedComponent);
    if (connectedComponentType !== 'OpenResponse') {
      delete connectedComponent.charactersPerLine;
      delete connectedComponent.spaceInbetweenLines;
      delete connectedComponent.fontSize;
    }
    if (connectedComponentType === 'OpenResponse') {
      connectedComponent.charactersPerLine ??= 100;
      connectedComponent.spaceInbetweenLines ??= 40;
      connectedComponent.fontSize ??= 16;
    }
  }
}
