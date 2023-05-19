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
import { OpenResponseAuthoring } from '../../components/openResponse/open-response-authoring/open-response-authoring.component';
import { MatchAuthoring } from '../../components/match/match-authoring/match-authoring.component';
import { AnimationAuthoring } from '../../components/animation/animation-authoring/animation-authoring.component';
import { MultipleChoiceAuthoring } from '../../components/multipleChoice/multiple-choice-authoring/multiple-choice-authoring.component';
import { AudioOscillatorAuthoring } from '../../components/audioOscillator/audio-oscillator-authoring/audio-oscillator-authoring.component';
import { ConceptMapAuthoring } from '../../components/conceptMap/concept-map-authoring/concept-map-authoring.component';
import { DialogGuidanceAuthoringComponent } from '../../components/dialogGuidance/dialog-guidance-authoring/dialog-guidance-authoring.component';
import { DiscussionAuthoring } from '../../components/discussion/discussion-authoring/discussion-authoring.component';
import { DrawAuthoring } from '../../components/draw/draw-authoring/draw-authoring.component';
import { EmbeddedAuthoring } from '../../components/embedded/embedded-authoring/embedded-authoring.component';
import { GraphAuthoring } from '../../components/graph/graph-authoring/graph-authoring.component';
import { HtmlAuthoring } from '../../components/html/html-authoring/html-authoring.component';
import { LabelAuthoring } from '../../components/label/label-authoring/label-authoring.component';
import { OutsideUrlAuthoring } from '../../components/outsideURL/outside-url-authoring/outside-url-authoring.component';
import { PeerChatAuthoringComponent } from '../../components/peerChat/peer-chat-authoring/peer-chat-authoring.component';
import { ShowGroupWorkAuthoringComponent } from '../../components/showGroupWork/show-group-work-authoring/show-group-work-authoring.component';
import { ShowMyWorkAuthoringComponent } from '../../components/showMyWork/show-my-work-authoring/show-my-work-authoring.component';
import { SummaryAuthoring } from '../../components/summary/summary-authoring/summary-authoring.component';
import { TableAuthoring } from '../../components/table/table-authoring/table-authoring.component';
import { ComponentContent } from '../../common/ComponentContent';

@Component({
  selector: 'component-authoring-component',
  template: '<div #component></div>'
})
export class ComponentAuthoringComponent {
  @Input() private componentContent: ComponentContent;
  @ViewChild('component') private componentElementRef: ElementRef;
  private componentRef: ComponentRef<any>;
  private componentTypeToComponentAuthoring = {
    Animation: AnimationAuthoring,
    AudioOscillator: AudioOscillatorAuthoring,
    ConceptMap: ConceptMapAuthoring,
    DialogGuidance: DialogGuidanceAuthoringComponent,
    Discussion: DiscussionAuthoring,
    Draw: DrawAuthoring,
    Embedded: EmbeddedAuthoring,
    Graph: GraphAuthoring,
    HTML: HtmlAuthoring,
    Label: LabelAuthoring,
    Match: MatchAuthoring,
    MultipleChoice: MultipleChoiceAuthoring,
    OpenResponse: OpenResponseAuthoring,
    OutsideURL: OutsideUrlAuthoring,
    PeerChat: PeerChatAuthoringComponent,
    ShowGroupWork: ShowGroupWorkAuthoringComponent,
    ShowMyWork: ShowMyWorkAuthoringComponent,
    Summary: SummaryAuthoring,
    Table: TableAuthoring
  };
  @Input() private nodeId: string;

  constructor(private applicationRef: ApplicationRef, private injector: EnvironmentInjector) {}

  ngAfterViewInit(): void {
    this.componentRef = createComponent(
      this.componentTypeToComponentAuthoring[this.componentContent.type],
      {
        hostElement: this.componentElementRef.nativeElement,
        environmentInjector: this.injector
      }
    );
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
