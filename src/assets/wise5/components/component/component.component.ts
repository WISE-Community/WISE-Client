import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickToSnipImageService } from '../../services/clickToSnipImageService';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'component',
  templateUrl: 'component.component.html'
})
export class ComponentComponent {
  @Input() componentId: string;
  @Input() componentState: any;
  @Input() nodeId: string;
  @Input() workgroupId: number;
  @Output() saveComponentStateEvent: EventEmitter<any> = new EventEmitter<any>();

  componentContent: any;
  pulseRubricIcon: boolean = true;
  rubric: string;
  showRubric: boolean;

  constructor(
    private clickToSnipImageService: ClickToSnipImageService,
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
    this.rubric = this.projectService.replaceAssetPaths(this.componentContent.rubric);
    this.showRubric = this.rubric != null && this.rubric != '' && this.configService.isPreview();
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
      componentContent = this.clickToSnipImageService.injectClickToSnipImageListener(
        componentContent
      );
    }
    this.componentContent = componentContent;
  }

  saveComponentState($event: any): void {
    this.saveComponentStateEvent.emit($event);
  }
}
