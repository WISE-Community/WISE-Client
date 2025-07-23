import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddComponentButtonComponent } from '../add-component-button/add-component-button.component';
import { MatDividerModule } from '@angular/material/divider';
import { Node } from '../../../common/Node';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-component',
  imports: [AddComponentButtonComponent, CommonModule, MatDividerModule],
  templateUrl: './add-component.component.html',
  styleUrl: './add-component.component.scss'
})
export class AddComponentComponent {
  @Input() afterComponentId: string;
  protected focus: boolean;
  @Output() newComponentsEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() node: Node;
}
