import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'component',
  templateUrl: 'component.component.html'
})
export class ComponentComponent {
  @Input()
  componentId: string;

  componentContent: any;

  @Input()
  componentState: any;

  mode: string = 'student';

  @Input()
  nodeId: string;

  type: string;

  @Input()
  workgroupId: number;

  @Output()
  saveComponentStateEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private configService: ConfigService,
    private notebookService: NotebookService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit() {
    if (this.componentState == null || this.componentState === '') {
      this.componentState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
    } else {
      this.nodeId = this.componentState.nodeId;
      this.componentId = this.componentState.componentId;
    }
    this.setComponentContent();
    this.type = this.componentContent.type;
  }

  setComponentContent(): void {
    let componentContent = this.projectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    componentContent = this.projectService.injectAssetPaths(componentContent);
    componentContent = this.configService.replaceStudentNames(componentContent);
    if (
      this.notebookService.isNotebookEnabled() &&
      this.notebookService.isStudentNoteClippingEnabled()
    ) {
      componentContent = this.projectService.injectClickToSnipImage(componentContent);
    }
    this.componentContent = componentContent;
  }

  saveComponentState($event: any): void {
    this.saveComponentStateEvent.emit($event);
  }
}
