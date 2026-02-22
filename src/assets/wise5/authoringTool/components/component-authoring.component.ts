import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { ComponentContent } from '../../common/ComponentContent';
import { PreviewComponentComponent } from './preview-component/preview-component.component';
import { EditComponentComponent } from './edit-component/edit-component.component';
import { ComponentFactory } from '../../common/ComponentFactory';
import { Component as WISEComponent } from '../../common/Component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherProjectTranslationService } from '../../services/teacherProjectTranslationService';
import { copy } from '../../common/object/object';

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
  protected component: WISEComponent;
  @Input() componentContent: ComponentContent;
  @Input() editing: boolean;
  @Output() editComponentEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() nodeId: string;

  constructor(
    private projectService: TeacherProjectService,
    private projectTranslationService: TeacherProjectTranslationService
  ) {
    effect(() => {
      // apply translations to a copy of the component content so the original component content
      // is not modified for subsequent use.
      const componentContent = copy(this.componentContent);
      this.projectTranslationService.applyTranslations(
        componentContent,
        this.projectTranslationService.currentTranslations()
      );
      this.component = new ComponentFactory().getComponent(
        this.projectService.injectAssetPaths(componentContent),
        this.nodeId
      );
    });
  }
}
