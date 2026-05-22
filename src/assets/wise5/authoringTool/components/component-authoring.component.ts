import { Component, effect, Input } from '@angular/core';
import { ComponentContent } from '../../common/ComponentContent';
import { PreviewComponentComponent } from './preview-component/preview-component.component';
import { ComponentFactory } from '../../common/ComponentFactory';
import { Component as WISEComponent } from '../../common/Component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherProjectTranslationService } from '../../services/teacherProjectTranslationService';
import { copy } from '../../common/object/object';
import { MatDialog } from '@angular/material/dialog';
import { EditComponentDialogComponent } from './edit-component-dialog/edit-component-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  imports: [PreviewComponentComponent, EditComponentDialogComponent, MatTooltipModule],
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
  template: `
    <preview-component
      role="button"
      tabindex="0"
      (click)="editComponent()"
      (keyup.enter)="editComponent()"
      [component]="component"
      [disabled]="true"
      matTooltip="Edit content"
      i18n-matTooltip
    />
  `
})
export class ComponentAuthoringComponent {
  protected component: WISEComponent;
  @Input() componentContent: ComponentContent;
  @Input() nodeId: string;
  private subscriptions = new Subscription();

  constructor(
    private dialog: MatDialog,
    private projectService: TeacherProjectService,
    private projectTranslationService: TeacherProjectTranslationService
  ) {
    effect(() => {
      this.setComponent();
    });
    this.subscriptions.add(
      this.projectService.projectSaved$.subscribe(() => {
        this.setComponent();
      })
    );
  }

  ngOnChanges(): void {
    this.setComponent();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setComponent(): void {
    // when current translations change, apply translations to a copy of the component content
    // so the original component content is not modified for subsequent use.
    const componentContent = copy(this.componentContent);
    this.projectTranslationService.applyTranslations(
      componentContent,
      this.projectTranslationService.currentTranslations()
    );
    this.component = new ComponentFactory().getComponent(
      this.projectService.injectAssetPaths(componentContent),
      this.nodeId
    );
  }

  protected editComponent(): void {
    this.dialog.open(EditComponentDialogComponent, {
      data: {
        componentContent: this.componentContent,
        nodeId: this.nodeId
      },
      height: '90vh',
      panelClass: 'dialog-xl'
    });
  }
}
