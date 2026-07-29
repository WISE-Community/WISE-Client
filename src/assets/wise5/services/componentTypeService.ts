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
          {
            type: 'HTML',
            name: this.getComponentTypeLabel('HTML'),
            icon: this.getComponentTypeIcon('HTML')
          },
          {
            type: 'ShowMyWork',
            name: this.getComponentTypeLabel('ShowMyWork'),
            icon: this.getComponentTypeIcon('ShowMyWork')
          },
          {
            type: 'Summary',
            name: this.getComponentTypeLabel('Summary'),
            icon: this.getComponentTypeIcon('Summary')
          }
        ]
      },
      {
        name: $localize`Explain and Assess`,
        types: [
          {
            type: 'ConceptMap',
            name: this.getComponentTypeLabel('ConceptMap'),
            icon: this.getComponentTypeIcon('ConceptMap')
          },
          {
            type: 'Draw',
            name: this.getComponentTypeLabel('Draw'),
            icon: this.getComponentTypeIcon('Draw')
          },
          {
            type: 'Label',
            name: this.getComponentTypeLabel('Label'),
            icon: this.getComponentTypeIcon('Label')
          },
          {
            type: 'MultipleChoice',
            name: this.getComponentTypeLabel('MultipleChoice'),
            icon: this.getComponentTypeIcon('MultipleChoice')
          },
          {
            type: 'OpenResponse',
            name: this.getComponentTypeLabel('OpenResponse'),
            icon: this.getComponentTypeIcon('OpenResponse')
          },
          {
            type: 'Match',
            name: this.getComponentTypeLabel('Match'),
            icon: this.getComponentTypeIcon('Match')
          }
        ]
      },
      {
        name: $localize`Experiment, Discover, Distinguish`,
        types: [
          {
            type: 'Animation',
            name: this.getComponentTypeLabel('Animation'),
            icon: this.getComponentTypeIcon('Animation')
          },
          {
            type: 'AudioOscillator',
            name: this.getComponentTypeLabel('AudioOscillator'),
            icon: this.getComponentTypeIcon('AudioOscillator')
          },
          {
            type: 'Embedded',
            name: this.getComponentTypeLabel('Embedded'),
            icon: this.getComponentTypeIcon('Embedded')
          },
          {
            type: 'Graph',
            name: this.getComponentTypeLabel('Graph'),
            icon: this.getComponentTypeIcon('Graph')
          },
          {
            type: 'OutsideURL',
            name: this.getComponentTypeLabel('OutsideURL'),
            icon: this.getComponentTypeIcon('OutsideURL')
          },
          {
            type: 'Table',
            name: this.getComponentTypeLabel('Table'),
            icon: this.getComponentTypeIcon('Table')
          }
        ]
      },
      {
        name: $localize`Collaborate`,
        types: [
          {
            type: 'DialogGuidance',
            name: this.getComponentTypeLabel('DialogGuidance'),
            icon: this.getComponentTypeIcon('DialogGuidance')
          },
          {
            type: 'Discussion',
            name: this.getComponentTypeLabel('Discussion'),
            icon: this.getComponentTypeIcon('Discussion')
          },
          {
            type: 'PeerChat',
            name: this.getComponentTypeLabel('PeerChat'),
            icon: this.getComponentTypeIcon('PeerChat')
          },
          {
            type: 'ShowGroupWork',
            name: this.getComponentTypeLabel('ShowGroupWork'),
            icon: this.getComponentTypeIcon('ShowGroupWork')
          }
        ]
      }
    ];

    if (this.isAiChatAllowed()) {
      groups[2].types.unshift({
        type: 'AiChat',
        name: this.getComponentTypeLabel('AiChat'),
        icon: this.getComponentTypeIcon('AiChat')
      });
    }

    return groups;
  }

  getComponentTypeIcon(componentType: string): string {
    return this.componentServiceLookupService.getService(componentType).getComponentTypeIcon();
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
