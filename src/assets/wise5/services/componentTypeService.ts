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
          this.createComponentType('HTML'),
          this.createComponentType('ShowMyWork'),
          this.createComponentType('Summary')
        ]
      },
      {
        name: $localize`Explain and Assess`,
        types: [
          this.createComponentType('ConceptMap'),
          this.createComponentType('Draw'),
          this.createComponentType('Label'),
          this.createComponentType('MultipleChoice'),
          this.createComponentType('OpenResponse'),
          this.createComponentType('Match')
        ]
      },
      {
        name: $localize`Experiment, Discover, Distinguish`,
        types: [
          this.createComponentType('Animation'),
          this.createComponentType('AudioOscillator'),
          this.createComponentType('Embedded'),
          this.createComponentType('Graph'),
          this.createComponentType('OutsideURL'),
          this.createComponentType('Table')
        ]
      },
      {
        name: $localize`Collaborate`,
        types: [
          this.createComponentType('DialogGuidance'),
          this.createComponentType('Discussion'),
          this.createComponentType('PeerChat'),
          this.createComponentType('ShowGroupWork')
        ]
      }
    ];

    if (this.isAiChatAllowed()) {
      groups[2].types.unshift(this.createComponentType('AiChat'));
    }

    return groups;
  }

  private createComponentType(componentType: string): any {
    return {
      type: componentType,
      name: this.getComponentTypeLabel(componentType),
      icon: this.getComponentTypeIcon(componentType)
    };
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
