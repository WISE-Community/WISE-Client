import {
  ApplicationRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  Input,
  ViewChild,
  createComponent,
  inject
} from '@angular/core';
import { components } from '../../components/Components';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  selector: 'component-grading-component',
  template: '<div #component></div>'
})
export class ComponentGradingComponent {
  private applicationRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private projectService = inject(TeacherProjectService);

  @ViewChild('component') private componentElementRef: ElementRef;
  @Input() private componentId: string;
  private componentRef: ComponentRef<any>;
  @Input() private componentState: any;
  @Input() private isRevision: boolean;
  @Input() private nodeId: string;
  @Input() private workgroupId: number;

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
