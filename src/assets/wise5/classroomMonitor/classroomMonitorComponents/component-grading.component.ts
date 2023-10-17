import {
  ApplicationRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  Input,
  ViewChild,
  createComponent
} from '@angular/core';
import { components } from '../../components/Components';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  selector: 'component-grading-component',
  template: '<div #component></div>'
})
export class ComponentGradingComponent {
  @ViewChild('component') private componentElementRef: ElementRef;
  @Input() private componentId: string;
  private componentRef: ComponentRef<any>;
  @Input() private componentState: any;
  @Input() private isRevision: boolean;
  @Input() private nodeId: string;
  @Input() private workgroupId: number;

  constructor(
    private applicationRef: ApplicationRef,
    private injector: EnvironmentInjector,
    private projectService: TeacherProjectService
  ) {}

  ngAfterViewInit(): void {
    const componentContent = this.projectService.getComponent(this.nodeId, this.componentId);
    this.componentRef = createComponent(components[componentContent.type].grading, {
      hostElement: this.componentElementRef.nativeElement,
      environmentInjector: this.injector
    });
    Object.assign(this.componentRef.instance, {
      componentId: this.componentId,
      componentState: this.componentState,
      isRevision: this.isRevision,
      nodeId: this.nodeId,
      workgroupId: this.workgroupId
    });
    this.applicationRef.attachView(this.componentRef.hostView);
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }
}
