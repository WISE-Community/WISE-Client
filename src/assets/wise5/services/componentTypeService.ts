import { Injectable } from '@angular/core';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { UserService } from '../../../app/services/user.service';
import { ConfigService } from './configService';

@Injectable()
export class ComponentTypeService {
  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  getComponentTypes(): any[] {
    const componentTypes = [
      { type: 'Animation', name: this.getComponentTypeLabel('Animation') },
      { type: 'AudioOscillator', name: this.getComponentTypeLabel('AudioOscillator') },
      { type: 'ConceptMap', name: this.getComponentTypeLabel('ConceptMap') },
      { type: 'DialogGuidance', name: this.getComponentTypeLabel('DialogGuidance') },
      { type: 'Discussion', name: this.getComponentTypeLabel('Discussion') },
      { type: 'Draw', name: this.getComponentTypeLabel('Draw') },
      { type: 'Embedded', name: this.getComponentTypeLabel('Embedded') },
      { type: 'Graph', name: this.getComponentTypeLabel('Graph') },
      { type: 'Label', name: this.getComponentTypeLabel('Label') },
      { type: 'Match', name: this.getComponentTypeLabel('Match') },
      { type: 'MultipleChoice', name: this.getComponentTypeLabel('MultipleChoice') },
      { type: 'OpenResponse', name: this.getComponentTypeLabel('OpenResponse') },
      { type: 'OutsideURL', name: this.getComponentTypeLabel('OutsideURL') },
      { type: 'PeerChat', name: this.getComponentTypeLabel('PeerChat') },
      { type: 'HTML', name: this.getComponentTypeLabel('HTML') },
      { type: 'ShowGroupWork', name: this.getComponentTypeLabel('ShowGroupWork') },
      { type: 'ShowMyWork', name: this.getComponentTypeLabel('ShowMyWork') },
      { type: 'Summary', name: this.getComponentTypeLabel('Summary') },
      { type: 'Table', name: this.getComponentTypeLabel('Table') }
    ];
    if (this.isAiChatAllowed()) {
      componentTypes.unshift({ type: 'AiChat', name: this.getComponentTypeLabel('AiChat') });
    }
    return componentTypes;
  }

  getComponentTypeLabel(componentType: string): string {
    return this.componentServiceLookupService.getService(componentType).getComponentTypeLabel();
  }

  private isAiChatAllowed(): boolean {
    return (
      this.configService.getConfigParam('chatGptEnabled') &&
      (this.userService.isAdmin() ||
        this.userService.isResearcher() ||
        this.userService.isTrustedAuthor())
    );
  }
}
