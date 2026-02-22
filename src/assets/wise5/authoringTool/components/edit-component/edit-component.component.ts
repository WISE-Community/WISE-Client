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
import { ComponentContent } from '../../../common/ComponentContent';
import { components } from '../../../components/Components';

@Component({
  selector: 'edit-component',
  template: '<div #component tabindex="-1"></div>'
})
export class EditComponentComponent {
  @Input() componentContent: ComponentContent;
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<any>;
  @Input() nodeId: string;

  constructor(
    private applicationRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  ngAfterViewInit(): void {
    const hostElement = this.componentElementRef.nativeElement;
    this.componentRef = createComponent(components[this.componentContent.type].authoring, {
      hostElement: hostElement,
      environmentInjector: this.injector
    });
    Object.assign(this.componentRef.instance, {
      componentContent: this.componentContent,
      nodeId: this.nodeId
    });
    this.applicationRef.attachView(this.componentRef.hostView);
    setTimeout(() => hostElement.focus());
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }
}
