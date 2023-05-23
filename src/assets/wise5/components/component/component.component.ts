import {
  ApplicationRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  createComponent
} from '@angular/core';
import { ClickToSnipImageService } from '../../services/clickToSnipImageService';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { Component as WISEComponent } from '../../common/Component';
import { ComponentFactory } from '../../common/ComponentFactory';
import { components } from '../Components';

@Component({
  selector: 'component',
  templateUrl: 'component.component.html'
})
export class ComponentComponent {
  protected component: WISEComponent;
  @ViewChild('component') private componentElementRef: ElementRef;
  @Input() private componentId: string;
  private componentRef: ComponentRef<WISEComponent>;
  @Input() protected componentState: any;
  @Input() private nodeId: string;
  protected rubric: string;
  @Output() protected saveComponentStateEvent: EventEmitter<any> = new EventEmitter<any>();
  protected showRubric: boolean;
  @Input() protected workgroupId: number;

  constructor(
    private applicationRef: ApplicationRef,
    private clickToSnipImageService: ClickToSnipImageService,
    private configService: ConfigService,
    private injector: EnvironmentInjector,
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
      this.rubric = this.component.content.rubric;
      this.showRubric = this.rubric != null && this.rubric != '';
    }
  }

  private setComponent(): void {
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

  ngAfterViewInit(): void {
    this.componentRef = createComponent(components[this.component.content.type].student, {
      hostElement: this.componentElementRef.nativeElement,
      environmentInjector: this.injector
    });
    Object.assign(this.componentRef.instance, {
      component: this.component,
      componentState: this.componentState,
      mode: 'student',
      saveComponentStateEvent: this.saveComponentStateEvent,
      workgroupId: this.workgroupId
    });
    this.applicationRef.attachView(this.componentRef.hostView);
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }
}
