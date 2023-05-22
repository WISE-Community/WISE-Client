import {
  ApplicationRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  createComponent
} from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { components } from '../../../components/Components';

@Component({
  selector: 'preview-component',
  template: '<div class="component__wrapper"><div #component></div></div>'
})
export class PreviewComponentComponent implements OnInit {
  @Input() protected component: WISEComponent;
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<WISEComponent>;
  @Input() protected periodId: number;
  @Output() private starterStateChangedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private applicationRef: ApplicationRef, private injector: EnvironmentInjector) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.componentRef = createComponent(components[this.component.content.type].student, {
      hostElement: this.componentElementRef.nativeElement,
      environmentInjector: this.injector
    });
    Object.assign(this.componentRef.instance, {
      component: this.component,
      mode: 'preview',
      periodId: this.periodId,
      starterStateChangedEvent: this.starterStateChangedEvent
    });
    this.applicationRef.attachView(this.componentRef.hostView);
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }
}
