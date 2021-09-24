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
    protected ProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.authoringComponentContent = this.ProjectService.getComponentByNodeIdAndComponentId(
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
    this.ProjectService.nodeChanged();
  }
}
