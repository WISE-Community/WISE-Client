import { Component } from '@angular/core';
import { EditConnectedComponentsComponent } from '../edit-connected-components/edit-connected-components.component';

@Component({ template: ''}) // this class needs to be a component to extends parent class and be used as a base class 
export class EditConnectedComponentsWithBackgroundComponent extends EditConnectedComponentsComponent {
  componentTypesThatCanImportWorkAsBackground: string[] = [];

  canConnectedComponentTypeImportWorkAsBackground(connectedComponent: any): boolean {
    return this.componentTypesThatCanImportWorkAsBackground.includes(
      this.getConnectedComponentType(connectedComponent)
    );
  }

  afterComponentIdChanged(connectedComponent: any): void {
    if (this.canConnectedComponentTypeImportWorkAsBackground(connectedComponent)) {
      connectedComponent.importWorkAsBackground = true;
    } else {
      delete connectedComponent.importWorkAsBackground;
    }
  }
}
