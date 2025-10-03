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
import { AiChatGradingModule } from '../../components/aiChat/ai-chat-grading/ai-chat-grading.module';
import { AudioOscillatorGradingModule } from '../../components/audioOscillator/audio-oscillator-grading/audio-oscillator-grading.module';
import { DiscussionGradingModule } from '../../components/discussion/discussion-grading/discussion-grading.module';
import { EmbeddedGradingModule } from '../../components/embedded/embedded-grading/embedded-grading.module';
import { GraphGradingModule } from '../../components/graph/graph-grading/graph-grading.module';
import { LabelGradingModule } from '../../components/label/label-grading/label-grading.module';
import { MatchGradingModule } from '../../components/match/match-grading/match-grading.module';
import { PeerChatGradingModule } from '../../components/peerChat/peer-chat-grading/peer-chat-grading.module';
import { ShowGroupWorkGradingModule } from '../../components/showGroupWork/show-group-work-grading/show-group-work-grading.module';
import { TableGradingModule } from '../../components/table/table-grading/table-grading.module';
import { ShowMyWorkGradingModule } from '../../components/showMyWork/show-my-work-grading/show-my-work-grading.module';

@Component({
  imports: [
    AiChatGradingModule,
    AudioOscillatorGradingModule,
    DiscussionGradingModule,
    EmbeddedGradingModule,
    GraphGradingModule,
    LabelGradingModule,
    MatchGradingModule,
    PeerChatGradingModule,
    ShowGroupWorkGradingModule,
    ShowMyWorkGradingModule,
    TableGradingModule
  ],
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
