import { Injectable } from '@angular/core';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ComponentService } from '../componentService';

@Injectable()
export class DialogGuidanceService extends ComponentService {
  constructor(protected computerAvatarService: ComputerAvatarService) {
    super();
  }

  getComponentTypeLabel(): string {
    return $localize`Dialog Guidance`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'DialogGuidance';
    component.itemId = '';
    component.feedbackRules = [];
    component.isComputerAvatarEnabled = false;
    component.computerAvatarSettings = this.getDefaultComputerAvatarSettings();
    component.version = 2;
    return component;
  }

  getDefaultComputerAvatarSettings(): any {
    return {
      ids: this.computerAvatarService.getAvatars().map((avatar) => avatar.id),
      label: this.getDefaultComputerAvatarLabel(),
      prompt: $localize`Discuss your answer with a thought buddy!`,
      initialResponse: $localize`Hi there! It's nice to meet you. What do you think about...`
    };
  }

  getDefaultComputerAvatarLabel(): string {
    return $localize`Thought Buddy`;
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
    return componentStates.length > 0;
  }
}
