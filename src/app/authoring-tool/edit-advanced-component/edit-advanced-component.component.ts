import { Directive, inject, Input } from '@angular/core';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';
import { Component } from '../../../assets/wise5/common/Component';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { TeacherNodeService } from '../../../assets/wise5/services/teacherNodeService';
import { moveObjectDown, moveObjectUp } from '../../../assets/wise5/common/array/array';
import { ComponentServiceLookupService } from '../../../assets/wise5/services/componentServiceLookupService';

@Directive()
export abstract class EditAdvancedComponentComponent {
  protected aiEnabled: boolean;
  component: Component;
  componentContent: ComponentContent;
  protected selectedTabIndex: number = 0;

  @Input() componentId: string;
  @Input() nodeId: string;
  @Input() tab: string = 'general';

  private componentServiceLookupService = inject(ComponentServiceLookupService);

  constructor(
    protected nodeService: TeacherNodeService,
    protected notebookService: NotebookService,
    protected teacherProjectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.componentContent = this.teacherProjectService.getComponent(this.nodeId, this.componentId);
    this.component = new Component(this.componentContent, this.nodeId);
    this.aiEnabled = this.teacherProjectService.getProject().ai?.enabled;
    if (this.aiEnabled && ['Discussion', 'OpenResponse'].includes(this.component.content.type)) {
      if (this.component.content.ai == null) {
        const componentService = this.componentServiceLookupService.getService(
          this.component.content.type
        );
        this.component.content.ai = {
          teacherSummarySystemPrompt: componentService.getDefaultTeacherSummarySystemPrompt(
            this.component.content.prompt
          )
        };
      }
    }
    this.teacherProjectService.uiChanged();

    switch (this.tab) {
      case 'visibility':
        this.selectedTabIndex = 1;
        break;
      default:
        this.selectedTabIndex = 0;
        break;
    }
  }

  setShowSubmitButtonValue(show: boolean = false): void {
    this.componentContent.showSaveButton = show;
    this.componentContent.showSubmitButton = show;
    this.nodeService.broadcastComponentShowSubmitButtonValueChanged({
      nodeId: this.nodeId,
      componentId: this.componentId,
      showSubmitButton: show
    });
  }

  isNotebookEnabled(): boolean {
    return this.notebookService.isNotebookEnabled();
  }

  connectedComponentsChanged(connectedComponents: any[]): void {
    this.componentContent.connectedComponents = connectedComponents;
    this.componentChanged();
  }

  componentChanged(): void {
    this.teacherProjectService.nodeChanged();
  }

  moveObjectUp(objects: any[], index: number): void {
    moveObjectUp(objects, index);
    this.componentChanged();
  }

  moveObjectDown(objects: any[], index: number): void {
    moveObjectDown(objects, index);
    this.componentChanged();
  }
}
