import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';

@Component({
  imports: [CommonModule, FormsModule, MatOptionModule, MatSelectModule],
  selector: 'select-component',
  standalone: true,
  templateUrl: './select-component.component.html'
})
export class SelectComponentComponent {
  @Input() components: any[];
  protected selectedComponent: any;
  @Output() componentChangedEvent: EventEmitter<any> = new EventEmitter();

  ngOnChanges(): void {
    this.selectComponent(this.components[0]);
  }

  protected selectComponent(component: any): void {
    this.selectedComponent = component;
    this.componentChangedEvent.emit(component);
  }
}
