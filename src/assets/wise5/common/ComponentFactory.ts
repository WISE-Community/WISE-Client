import { AiChatComponent } from '../components/aiChat/AiChatComponent';
import { DialogGuidanceComponent } from '../components/dialogGuidance/DialogGuidanceComponent';
import { MultipleChoiceComponent } from '../components/multipleChoice/MultipleChoiceComponent';
import { PeerChatComponent } from '../components/peerChat/PeerChatComponent';
import { ShowGroupWorkComponent } from '../components/showGroupWork/ShowGroupWorkComponent';
import { Component } from './Component';
import { ComponentContent } from './ComponentContent';

export class ComponentFactory {
  getComponent(content: ComponentContent, nodeId: string): Component {
    if (content.type === 'AiChat') {
      return new AiChatComponent(content, nodeId);
    } else if (content.type === 'DialogGuidance') {
      return new DialogGuidanceComponent(content, nodeId);
    } else if (content.type === 'MultipleChoice') {
      return new MultipleChoiceComponent(content, nodeId);
    } else if (content.type === 'PeerChat') {
      return new PeerChatComponent(content, nodeId);
    } else if (content.type === 'ShowGroupWork') {
      return new ShowGroupWorkComponent(content, nodeId);
    } else {
      return new Component(content, nodeId);
    }
  }
}
