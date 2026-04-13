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

  getComponentGroups(): any[] {
    const groups = [
      {
        name: $localize`View Information`,
        types: [
          { type: 'HTML', name: this.getComponentTypeLabel('HTML') },
          { type: 'Summary', name: this.getComponentTypeLabel('Summary') },
          { type: 'ShowMyWork', name: this.getComponentTypeLabel('ShowMyWork') }
        ]
      },
      {
        name: $localize`Explain and Assess`,
        types: [
          { type: 'ConceptMap', name: this.getComponentTypeLabel('ConceptMap') },
          { type: 'Draw', name: this.getComponentTypeLabel('Draw') },
          { type: 'Label', name: this.getComponentTypeLabel('Label') },
          { type: 'MultipleChoice', name: this.getComponentTypeLabel('MultipleChoice') },
          { type: 'OpenResponse', name: this.getComponentTypeLabel('OpenResponse') },
          { type: 'Match', name: this.getComponentTypeLabel('Match') }
        ]
      },
      {
        name: $localize`Collaborate`,
        types: [
          { type: 'DialogGuidance', name: this.getComponentTypeLabel('DialogGuidance') },
          { type: 'Discussion', name: this.getComponentTypeLabel('Discussion') },
          { type: 'PeerChat', name: this.getComponentTypeLabel('PeerChat') },
          { type: 'ShowGroupWork', name: this.getComponentTypeLabel('ShowGroupWork') }
        ]
      },
      {
        name: $localize`Experiment, Discover and Distinguish`,
        types: [
          { type: 'Animation', name: this.getComponentTypeLabel('Animation') },
          { type: 'AudioOscillator', name: this.getComponentTypeLabel('AudioOscillator') },
          { type: 'Embedded', name: this.getComponentTypeLabel('Embedded') },
          { type: 'Graph', name: this.getComponentTypeLabel('Graph') },
          { type: 'OutsideURL', name: this.getComponentTypeLabel('OutsideURL') },
          { type: 'Table', name: this.getComponentTypeLabel('Table') }
        ]
      }
    ];

    if (this.isAiChatAllowed()) {
      groups[2].types.unshift({ type: 'AiChat', name: this.getComponentTypeLabel('AiChat') });
    }

    return groups;
  }

  getComponentTypes(): any[] {
    return this.getComponentGroups().flatMap((group) => group.types);
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
