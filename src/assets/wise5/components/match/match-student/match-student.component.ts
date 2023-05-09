import {
  ApplicationRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  createComponent
} from '@angular/core';
import { MatchStudentChoiceReuse } from './match-student-choice-reuse/match-student-choice-reuse';
import { MatchStudentDefault } from './match-student-default/match-student-default.component';
import { MatchContent } from '../MatchContent';

@Component({
  selector: 'match-student',
  template: '<div #component></div>'
})
export class MatchStudent {
  @Input() component: any;
  @Input() componentState: any;
  @Input() mode: string;
  @Input() workgroupId: number;
  @Output() saveComponentStateEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('component') private componentElementRef: ElementRef;

  constructor(private applicationRef: ApplicationRef, private injector: EnvironmentInjector) {}

  ngAfterViewInit(): void {
    const componentRef = createComponent(
      (this.component.content as MatchContent).choiceReuseEnabled
        ? MatchStudentChoiceReuse
        : MatchStudentDefault,
      {
        hostElement: this.componentElementRef.nativeElement,
        environmentInjector: this.injector
      }
    );
    Object.assign(componentRef.instance, {
      component: this.component,
      componentState: this.componentState,
      mode: this.mode,
      workgroupId: this.workgroupId,
      saveComponentStateEvent: this.saveComponentStateEvent
    });
    this.applicationRef.attachView(componentRef.hostView);
  }
}
