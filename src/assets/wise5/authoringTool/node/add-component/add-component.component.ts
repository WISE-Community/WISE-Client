import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddComponentButtonComponent } from '../add-component-button/add-component-button.component';
import { MatDividerModule } from '@angular/material/divider';
import { Node } from '../../../common/Node';
import { CommonModule } from '@angular/common';

@Component({
  imports: [AddComponentButtonComponent, CommonModule, MatDividerModule],
  selector: 'add-component',
  styleUrl: './add-component.component.scss',
  templateUrl: './add-component.component.html'
})
export class AddComponentComponent {
  @Input() afterComponentId: string;
  protected focus: boolean;
  @Output() newComponentsEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() node: Node;
}
