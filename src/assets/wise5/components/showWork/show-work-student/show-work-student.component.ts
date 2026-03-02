import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  ElementRef,
  EnvironmentInjector,
  Input,
  ViewChild
} from '@angular/core';
import { components } from '../../Components';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'show-work-student',
  template: '<div #component></div>'
})
export class ShowWorkStudentComponent {
  @Input() additionalSettings: any;
  @Input() componentContent: any;
  @Input() componentId: string;
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<ComponentShowWorkDirective>;
  @Input() nodeId: string;
  @Input() studentWork: any;

  constructor(
    private applicationRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    if (this.componentElementRef != null) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }

  private render(): void {
    if (components[this.studentWork.componentType].showWork) {
      this.componentRef = createComponent(components[this.studentWork.componentType].showWork, {
        hostElement: this.componentElementRef.nativeElement,
        environmentInjector: this.injector
      });
      Object.assign(this.componentRef.instance, {
        additionalSettings: this.additionalSettings,
        componentId: this.componentId,
        componentState: this.studentWork,
        isDisabled: true,
        mode: 'student',
        nodeId: this.nodeId,
        workgroupId: this.studentWork.workgroupId
      });
      this.applicationRef.attachView(this.componentRef.hostView);
    }
  }
}
