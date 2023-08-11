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
import { ComponentContent } from '../../common/ComponentContent';
import { components } from '../../components/Components';

@Component({
  selector: 'component-authoring-component',
  template: '<div #component></div>'
})
export class ComponentAuthoringComponent {
  @Input() private componentContent: ComponentContent;
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<any>;
  @Input() private nodeId: string;

  constructor(private applicationRef: ApplicationRef, private injector: EnvironmentInjector) {}

  ngAfterViewInit(): void {
    this.componentRef = createComponent(components[this.componentContent.type].authoring, {
      hostElement: this.componentElementRef.nativeElement,
      environmentInjector: this.injector
    });
    Object.assign(this.componentRef.instance, {
      componentContent: this.componentContent,
      nodeId: this.nodeId
    });
    this.applicationRef.attachView(this.componentRef.hostView);
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }
}
