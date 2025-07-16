import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectStepAndComponentComponent } from '../select-step-and-component/select-step-and-component.component';
import { EditConnectedComponentTypeSelectComponent } from '../edit-connected-component-type-select/edit-connected-component-type-select.component';

@Component({
  imports: [EditConnectedComponentTypeSelectComponent, SelectStepAndComponentComponent],
  selector: 'edit-connected-component-default-selects',
  template: `<div class="flex flex-row flex-wrap gap-5">
    <select-step-and-component
      [referenceComponent]="connectedComponent"
      [thisComponentId]="componentId"
      [allowedComponentTypes]="allowedConnectedComponentTypes"
      (stepChange)="connectedComponentNodeIdChanged()"
      (componentChange)="connectedComponentComponentIdChanged()"
    />
    <edit-connected-component-type-select
      [connectedComponent]="connectedComponent"
      (connectedComponentChange)="connectedComponentTypeChanged()"
    />
  </div> `
})
export class EditConnectedComponentDefaultSelectsComponent {
  @Input() allowedConnectedComponentTypes: string[];
  @Input() componentId: string;
  @Input() connectedComponent: any;
  @Output() connectedComponentComponentIdChange: EventEmitter<any> = new EventEmitter();
  @Output() connectedComponentNodeIdChange: EventEmitter<any> = new EventEmitter();
  @Output() connectedComponentTypeChange: EventEmitter<any> = new EventEmitter();

  protected connectedComponentNodeIdChanged(): void {
    this.connectedComponentNodeIdChange.emit(this.connectedComponent);
  }

  protected connectedComponentComponentIdChanged(): void {
    this.connectedComponentComponentIdChange.emit(this.connectedComponent);
  }

  protected connectedComponentTypeChanged(): void {
    this.connectedComponentTypeChange.emit(this.connectedComponent);
  }
}
