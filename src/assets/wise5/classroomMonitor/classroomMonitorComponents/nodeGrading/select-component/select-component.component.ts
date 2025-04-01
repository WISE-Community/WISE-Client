import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentContent } from '../../../../common/ComponentContent';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  selector: 'select-component',
  standalone: true,
  styleUrls: ['./select-component.component.scss'],
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
