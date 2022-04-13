import { Component } from '@angular/core';
import { EditConnectedComponentsWithBackgroundComponent } from '../../../../../app/authoring-tool/edit-connected-components-with-background/edit-connected-components-with-background.component';

@Component({
  selector: 'edit-label-connected-components',
  templateUrl: './edit-label-connected-components.component.html',
  styleUrls: [
    '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.scss',
    './edit-label-connected-components.component.scss'
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
