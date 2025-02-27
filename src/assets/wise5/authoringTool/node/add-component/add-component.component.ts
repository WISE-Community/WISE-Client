import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddComponentButtonComponent } from '../add-component-button/add-component-button.component';
import { MatDividerModule } from '@angular/material/divider';
import { Node } from '../../../common/Node';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
    selector: 'add-component',
    imports: [AddComponentButtonComponent, CommonModule, FlexLayoutModule, MatDividerModule],
    templateUrl: './add-component.component.html',
    styleUrl: './add-component.component.scss'
})
export class AddComponentComponent {
  @Input() afterComponentId: string;
  @Input() node: Node;
  @Output() newComponentsEvent: EventEmitter<any> = new EventEmitter<any>();
  protected focus: boolean;
}
