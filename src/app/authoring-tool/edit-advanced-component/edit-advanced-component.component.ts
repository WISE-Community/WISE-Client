import { Directive, Input } from '@angular/core';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';
import { Component } from '../../../assets/wise5/common/Component';
import { NodeService } from '../../../assets/wise5/services/nodeService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Directive()
export abstract class EditAdvancedComponentComponent {
  component: Component;
  componentContent: ComponentContent;
  @Input() componentId: string;
  @Input() nodeId: string;

  constructor(
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    protected teacherProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.componentContent = this.teacherProjectService.getComponent(this.nodeId, this.componentId);
    this.component = new Component(this.componentContent, this.nodeId);
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
    this.teacherProjectService.moveObjectUp(objects, index);
    this.componentChanged();
  }

  moveObjectDown(objects: any[], index: number): void {
    this.teacherProjectService.moveObjectDown(objects, index);
    this.componentChanged();
  }
}
