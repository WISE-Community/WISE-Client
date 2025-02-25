import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeIconAndTitleComponent } from '../node-icon-and-title/node-icon-and-title.component';
import { InsertNodeAfterButtonComponent } from '../insert-node-after-button/insert-node-after-button.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
    imports: [
        CommonModule,
        FlexLayoutModule,
        InsertNodeAfterButtonComponent,
        NodeIconAndTitleComponent
    ],
    selector: 'node-with-move-after-button',
    templateUrl: './node-with-move-after-button.component.html'
})
export class NodeWithMoveAfterButtonComponent {
  @Input() protected disabled: boolean;
  @Output() protected insertEvent = new EventEmitter();
  @Input() protected nodeId: string;
}
