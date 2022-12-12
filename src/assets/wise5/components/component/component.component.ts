import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickToSnipImageService } from '../../services/clickToSnipImageService';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { Component as WISEComponent } from '../../common/Component';
import { ComponentFactory } from '../../common/ComponentFactory';

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

  component: WISEComponent;
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
    this.setComponent();
    if (this.configService.isPreview()) {
      this.rubric = this.projectService.replaceAssetPaths(this.component.content.rubric);
      this.showRubric = this.rubric != null && this.rubric != '';
    }
  }

  setComponent(): void {
    let content = this.projectService.getComponent(this.nodeId, this.componentId);
    content = this.projectService.injectAssetPaths(content);
    content = this.configService.replaceStudentNames(content);
    if (
      this.notebookService.isNotebookEnabled() &&
      this.notebookService.isStudentNoteClippingEnabled()
    ) {
      content = this.clickToSnipImageService.injectClickToSnipImageListener(content);
    }
    const factory = new ComponentFactory();
    this.component = factory.getComponent(content, this.nodeId);
  }

  saveComponentState($event: any): void {
    this.saveComponentStateEvent.emit($event);
  }
}
