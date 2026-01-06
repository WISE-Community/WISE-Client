import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ReferenceComponent } from '../../domain/referenceComponent';
import { SelectStepComponent } from '../select-step/select-step.component';
import { SelectComponentComponent } from '../select-component/select-component.component';

@Component({
  imports: [SelectComponentComponent, SelectStepComponent],
  selector: 'select-step-and-component',
  styles: ['select-step { margin-right: 20px; }'],
  template: `<select-step
      [nodeId]="referenceComponent.nodeId"
      (stepChangedEvent)="stepChanged($event)"
    />
    <select-component
      [allowedComponentTypes]="allowedComponentTypes"
      [nodeId]="referenceComponent.nodeId"
      [componentId]="referenceComponent.componentId"
      [thisComponentId]="thisComponentId"
      (componentChangedEvent)="componentChanged($event)"
    />`
})
export class SelectStepAndComponentComponent {
  private changeDetector = inject(ChangeDetectorRef);

  @Input() allowedComponentTypes: string[] = [];
  @Output() componentChange: EventEmitter<ReferenceComponent> = new EventEmitter();
  @Input() referenceComponent: ReferenceComponent;
  @Output() stepChange: EventEmitter<ReferenceComponent> = new EventEmitter();
  @Input() thisComponentId: string;

  protected stepChanged(nodeId: string): void {
    this.referenceComponent.nodeId = nodeId;
    this.changeDetector.detectChanges();
    this.stepChange.emit(this.referenceComponent);
  }

  protected componentChanged(componentId: string): void {
    this.referenceComponent.componentId = componentId;
    this.changeDetector.detectChanges();
    this.componentChange.emit(this.referenceComponent);
  }
}
