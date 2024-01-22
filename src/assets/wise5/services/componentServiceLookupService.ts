import { Injectable } from '@angular/core';
import { AnimationService } from '../components/animation/animationService';
import { AudioOscillatorService } from '../components/audioOscillator/audioOscillatorService';
import { ConceptMapService } from '../components/conceptMap/conceptMapService';
import { DialogGuidanceService } from '../components/dialogGuidance/dialogGuidanceService';
import { DiscussionService } from '../components/discussion/discussionService';
import { DrawService } from '../components/draw/drawService';
import { EmbeddedService } from '../components/embedded/embeddedService';
import { GraphService } from '../components/graph/graphService';
import { HTMLService } from '../components/html/htmlService';
import { LabelService } from '../components/label/labelService';
import { MatchService } from '../components/match/matchService';
import { MultipleChoiceService } from '../components/multipleChoice/multipleChoiceService';
import { OpenResponseService } from '../components/openResponse/openResponseService';
import { OutsideURLService } from '../components/outsideURL/outsideURLService';
import { PeerChatService } from '../components/peerChat/peerChatService';
import { ShowGroupWorkService } from '../components/showGroupWork/showGroupWorkService';
import { ShowMyWorkService } from '../components/showMyWork/showMyWorkService';
import { SummaryService } from '../components/summary/summaryService';
import { TableService } from '../components/table/tableService';
import { AiChatService } from '../components/aiChat/aiChatService';

@Injectable()
export class ComponentServiceLookupService {
  services = new Map<string, any>();

  constructor(
    private aiChatService: AiChatService,
    private animationService: AnimationService,
    private audioOscillatorService: AudioOscillatorService,
    private conceptMapService: ConceptMapService,
    private dialogGuidanceService: DialogGuidanceService,
    private discussionService: DiscussionService,
    private drawService: DrawService,
    private embeddedService: EmbeddedService,
    private graphService: GraphService,
    private labelService: LabelService,
    private matchService: MatchService,
    private multipleChoiceService: MultipleChoiceService,
    private openResponseService: OpenResponseService,
    private outsideURLService: OutsideURLService,
    private peerChatService: PeerChatService,
    private htmlService: HTMLService,
    private showGroupWorkService: ShowGroupWorkService,
    private showMyWorkService: ShowMyWorkService,
    private summaryService: SummaryService,
    private tableService: TableService
  ) {
    this.services.set('AiChat', this.aiChatService);
    this.services.set('Animation', this.animationService);
    this.services.set('AudioOscillator', this.audioOscillatorService);
    this.services.set('ConceptMap', this.conceptMapService);
    this.services.set('DialogGuidance', this.dialogGuidanceService);
    this.services.set('Discussion', this.discussionService);
    this.services.set('Draw', this.drawService);
    this.services.set('Embedded', this.embeddedService);
    this.services.set('Graph', this.graphService);
    this.services.set('Label', this.labelService);
    this.services.set('Match', this.matchService);
    this.services.set('MultipleChoice', this.multipleChoiceService);
    this.services.set('OpenResponse', this.openResponseService);
    this.services.set('OutsideURL', this.outsideURLService);
    this.services.set('PeerChat', this.peerChatService);
    this.services.set('HTML', this.htmlService);
    this.services.set('ShowGroupWork', this.showGroupWorkService);
    this.services.set('ShowMyWork', this.showMyWorkService);
    this.services.set('Summary', this.summaryService);
    this.services.set('Table', this.tableService);
  }

  getService(componentType: string): any {
    return this.services.get(componentType);
  }
}
