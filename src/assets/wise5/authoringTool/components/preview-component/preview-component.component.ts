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
import { AnimationStudent } from '../../../components/animation/animation-student/animation-student.component';
import { AudioOscillatorStudent } from '../../../components/audioOscillator/audio-oscillator-student/audio-oscillator-student.component';
import { ConceptMapStudent } from '../../../components/conceptMap/concept-map-student/concept-map-student.component';
import { DiscussionStudent } from '../../../components/discussion/discussion-student/discussion-student.component';
import { DrawStudent } from '../../../components/draw/draw-student/draw-student.component';
import { EmbeddedStudent } from '../../../components/embedded/embedded-student/embedded-student.component';
import { GraphStudent } from '../../../components/graph/graph-student/graph-student.component';
import { HtmlStudent } from '../../../components/html/html-student/html-student.component';
import { LabelStudent } from '../../../components/label/label-student/label-student.component';
import { MatchStudent } from '../../../components/match/match-student/match-student.component';
import { MultipleChoiceStudent } from '../../../components/multipleChoice/multiple-choice-student/multiple-choice-student.component';
import { OpenResponseStudent } from '../../../components/openResponse/open-response-student/open-response-student.component';
import { OutsideUrlStudent } from '../../../components/outsideURL/outside-url-student/outside-url-student.component';
import { SummaryStudent } from '../../../components/summary/summary-student/summary-student.component';
import { TableStudent } from '../../../components/table/table-student/table-student.component';
import { DialogGuidanceStudentComponent } from '../../../components/dialogGuidance/dialog-guidance-student/dialog-guidance-student.component';
import { PeerChatStudentComponent } from '../../../components/peerChat/peer-chat-student/peer-chat-student.component';
import { ShowGroupWorkStudentComponent } from '../../../components/showGroupWork/show-group-work-student/show-group-work-student.component';
import { ShowMyWorkStudentComponent } from '../../../components/showMyWork/show-my-work-student/show-my-work-student.component';

@Component({
  selector: 'preview-component',
  template: '<div class="component__wrapper"><div #component></div></div>'
})
export class PreviewComponentComponent implements OnInit {
  @Input() protected component: WISEComponent;
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<WISEComponent>;
  private componentTypeToComponentPreview = {
    Animation: AnimationStudent,
    AudioOscillator: AudioOscillatorStudent,
    ConceptMap: ConceptMapStudent,
    DialogGuidance: DialogGuidanceStudentComponent,
    Discussion: DiscussionStudent,
    Draw: DrawStudent,
    Embedded: EmbeddedStudent,
    Graph: GraphStudent,
    HTML: HtmlStudent,
    Label: LabelStudent,
    Match: MatchStudent,
    MultipleChoice: MultipleChoiceStudent,
    OpenResponse: OpenResponseStudent,
    OutsideURL: OutsideUrlStudent,
    PeerChat: PeerChatStudentComponent,
    ShowGroupWork: ShowGroupWorkStudentComponent,
    ShowMyWork: ShowMyWorkStudentComponent,
    Summary: SummaryStudent,
    Table: TableStudent
  };
  @Input() protected periodId: number;
  @Output() private starterStateChangedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private applicationRef: ApplicationRef, private injector: EnvironmentInjector) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.componentRef = createComponent(
      this.componentTypeToComponentPreview[this.component.content.type],
      {
        hostElement: this.componentElementRef.nativeElement,
        environmentInjector: this.injector
      }
    );
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
