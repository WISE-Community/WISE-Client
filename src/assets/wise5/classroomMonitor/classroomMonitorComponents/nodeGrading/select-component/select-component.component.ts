import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { ComponentContent } from '../../../../common/ComponentContent';

@Component({
  imports: [CommonModule, FormsModule, MatOptionModule, MatSelectModule],
  selector: 'select-component',
  templateUrl: './select-component.component.html'
})
export class SelectComponentComponent {
  @Input() components: any[];
  @Input() selectedComponent: ComponentContent;
  @Output() componentChangedEvent: EventEmitter<any> = new EventEmitter();

  protected selectComponent(component: ComponentContent): void {
    this.selectedComponent = component;
    this.componentChangedEvent.emit(component);
  }
}
