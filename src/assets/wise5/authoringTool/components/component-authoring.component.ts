import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentContent } from '../../common/ComponentContent';
import { PreviewComponentComponent } from './preview-component/preview-component.component';
import { EditComponentComponent } from './edit-component/edit-component.component';
import { ComponentFactory } from '../../common/ComponentFactory';
import { Component as WISEComponent } from '../../common/Component';

@Component({
  imports: [PreviewComponentComponent, EditComponentComponent],
  selector: 'component-authoring',
  standalone: true,
  template: `@if (editing) {
      <edit-component [componentContent]="componentContent" [nodeId]="nodeId" />
    } @else {
      <preview-component (click)="editComponentEvent.emit()" [component]="component" />
    }`
})
export class ComponentAuthoringComponent {
  protected component: WISEComponent;
  @Input() componentContent: ComponentContent;
  @Input() editing: boolean;
  @Output() editComponentEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() nodeId: string;

  ngOnChanges(): void {
    this.component = new ComponentFactory().getComponent(this.componentContent, this.nodeId);
  }
}
