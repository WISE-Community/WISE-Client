import { Directive, Input } from '@angular/core';
import { NodeService } from '../../../assets/wise5/services/nodeService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Directive()
export abstract class EditAdvancedComponentComponent {
  authoringComponentContent: any;
  @Input()
  componentId: string;
  @Input()
  nodeId: string;

  constructor(
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected TeacherProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.authoringComponentContent = this.TeacherProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
  }

  setShowSubmitButtonValue(show: boolean = false): void {
    this.authoringComponentContent.showSaveButton = show;
    this.authoringComponentContent.showSubmitButton = show;
    this.NodeService.broadcastComponentShowSubmitButtonValueChanged({
      nodeId: this.nodeId,
      componentId: this.componentId,
      showSubmitButton: show
    });
  }

  isNotebookEnabled(): boolean {
    return this.NotebookService.isNotebookEnabled();
  }

  connectedComponentsChanged(connectedComponents: any[]): void {
    this.authoringComponentContent.connectedComponents = connectedComponents;
    this.componentChanged();
  }

  componentChanged(): void {
    this.TeacherProjectService.nodeChanged();
  }

  moveObjectUp(objects: any[], index: number): void {
    this.TeacherProjectService.moveObjectUp(objects, index);
    this.componentChanged();
  }

  moveObjectDown(objects: any[], index: number): void {
    this.TeacherProjectService.moveObjectDown(objects, index);
    this.componentChanged();
  }
}
