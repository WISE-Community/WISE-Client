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
  createComponent,
  inject
} from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { components } from '../../../components/Components';

@Component({
  selector: 'preview-component',
  template: '<div #component></div>'
})
export class PreviewComponentComponent {
  private applicationRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  @Input() component: WISEComponent;
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<WISEComponent>;
  @Input() disabled: boolean;
  @Input() periodId: number;
  @Output() starterStateChangedEvent: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit(): void {
    this.renderComponent();
  }

  ngOnChanges(): void {
    if (this.componentElementRef != null) {
      this.renderComponent();
    }
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }

  private renderComponent(): void {
    this.componentRef = createComponent(components[this.component.content.type].student, {
      hostElement: this.componentElementRef.nativeElement,
      environmentInjector: this.injector
    });
    Object.assign(this.componentRef.instance, {
      component: this.component,
      mode: 'preview',
      periodId: this.periodId,
      isDisabled: this.disabled,
      starterStateChangedEvent: this.starterStateChangedEvent
    });
    this.applicationRef.attachView(this.componentRef.hostView);
  }
}
