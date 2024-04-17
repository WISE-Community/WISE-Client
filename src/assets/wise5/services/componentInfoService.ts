import { Injectable } from '@angular/core';
import { MultipleChoiceInfo } from '../components/multipleChoice/MultipleChoiceInfo';
import { OpenResponseInfo } from '../components/openResponse/OpenResponseInfo';
import { AnimationInfo } from '../components/animation/AnimationInfo';
import { AudioOscillatorInfo } from '../components/audioOscillator/AudioOscillatorInfo';
import { ConceptMapInfo } from '../components/conceptMap/ConceptMapInfo';
import { DialogGuidanceInfo } from '../components/dialogGuidance/DialogGuidanceInfo';
import { DiscussionInfo } from '../components/discussion/DiscussionInfo';
import { DrawInfo } from '../components/draw/DrawInfo';
import { EmbeddedInfo } from '../components/embedded/EmbeddedInfo';
import { GraphInfo } from '../components/graph/GraphInfo';
import { HtmlInfo } from '../components/html/HtmlInfo';
import { LabelInfo } from '../components/label/LabelInfo';
import { MatchInfo } from '../components/match/MatchInfo';
import { OutsideUrlInfo } from '../components/outsideURL/OutsideUrlInfo';
import { PeerChatInfo } from '../components/peerChat/PeerChatInfo';
import { ShowGroupWorkInfo } from '../components/showGroupWork/ShowGroupWorkInfo';
import { ShowMyWorkInfo } from '../components/showMyWork/ShowMyWorkInfo';
import { SummaryInfo } from '../components/summary/SummaryInfo';
import { TableInfo } from '../components/table/TableInfo';
import { ComponentInfo } from '../components/ComponentInfo';
import { AiChatInfo } from '../components/aiChat/AiChatInfo';

@Injectable()
export class ComponentInfoService {
  private componentInfo = {
    AiChat: new AiChatInfo(),
    Animation: new AnimationInfo(),
    AudioOscillator: new AudioOscillatorInfo(),
    ConceptMap: new ConceptMapInfo(),
    DialogGuidance: new DialogGuidanceInfo(),
    Discussion: new DiscussionInfo(),
    Draw: new DrawInfo(),
    Embedded: new EmbeddedInfo(),
    Graph: new GraphInfo(),
    HTML: new HtmlInfo(),
    Label: new LabelInfo(),
    Match: new MatchInfo(),
    MultipleChoice: new MultipleChoiceInfo(),
    OpenResponse: new OpenResponseInfo(),
    OutsideURL: new OutsideUrlInfo(),
    PeerChat: new PeerChatInfo(),
    ShowGroupWork: new ShowGroupWorkInfo(),
    ShowMyWork: new ShowMyWorkInfo(),
    Summary: new SummaryInfo(),
    Table: new TableInfo()
  };

  getInfo(componentType: string): ComponentInfo {
    return this.componentInfo[componentType];
  }
}
