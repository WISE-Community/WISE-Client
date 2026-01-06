import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ComponentContent } from '../../common/ComponentContent';
import { PreviewComponentComponent } from './preview-component/preview-component.component';
import { EditComponentComponent } from './edit-component/edit-component.component';
import { ComponentFactory } from '../../common/ComponentFactory';
import { Component as WISEComponent } from '../../common/Component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [PreviewComponentComponent, EditComponentComponent, MatTooltipModule],
  selector: 'component-authoring',
  styles: [
    `
      preview-component {
        display: block;
        position: relative;
        cursor: pointer;
      }
      preview-component:hover {
        outline: 3px dashed #aaaaaa;
        outline-offset: 8px;
      }
      preview-component:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    `
  ],
  template: `@if (editing) {
      <edit-component [componentContent]="componentContent" [nodeId]="nodeId" />
    } @else {
      <preview-component
        role="button"
        tabindex="0"
        (click)="editComponentEvent.emit()"
        (keyup.enter)="editComponentEvent.emit()"
        [component]="component"
        [disabled]="true"
        matTooltip="Edit content"
        i18n-matTooltip
      />
    }`
})
export class ComponentAuthoringComponent {
  private projectService = inject(TeacherProjectService);

  protected component: WISEComponent;
  @Input() componentContent: ComponentContent;
  @Input() editing: boolean;
  @Output() editComponentEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() nodeId: string;

  ngOnChanges(): void {
    this.component = new ComponentFactory().getComponent(
      this.projectService.injectAssetPaths(this.componentContent),
      this.nodeId
    );
  }
}
