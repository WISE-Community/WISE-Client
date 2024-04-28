import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReferenceComponent } from '../../domain/referenceComponent';
import { SelectStepComponent } from '../select-step/select-step.component';
import { SelectComponentComponent } from '../select-component/select-component.component';

@Component({
  selector: 'select-step-and-component',
  templateUrl: './select-step-and-component.component.html',
  styleUrls: ['./select-step-and-component.component.scss'],
  standalone: true,
  imports: [SelectComponentComponent, SelectStepComponent]
})
export class SelectStepAndComponentComponent {
  @Input() allowedComponentTypes: string[] = [];
  @Output() componentChange: EventEmitter<ReferenceComponent> = new EventEmitter();
  @Input() referenceComponent: ReferenceComponent;
  @Output() stepChange: EventEmitter<ReferenceComponent> = new EventEmitter();
  @Input() thisComponentId: string;

  constructor(private changeDetector: ChangeDetectorRef) {}

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
