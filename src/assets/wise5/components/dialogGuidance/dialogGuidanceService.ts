import { inject, Injectable } from '@angular/core';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ComponentService } from '../componentService';

@Injectable()
export class DialogGuidanceService extends ComponentService {
  protected computerAvatarService = inject(ComputerAvatarService);

  getComponentTypeLabel(): string {
    return $localize`Dialog Guidance`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'DialogGuidance';
    component.itemId = '';
    component.feedbackRules = [];
    component.isComputerAvatarEnabled = false;
    component.computerAvatarSettings =
      this.computerAvatarService.getDefaultComputerAvatarSettings();
    component.version = 2;
    component.cRaterRubric = { ideas: [] };
    return component;
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
    return componentStates.length > 0;
  }
}
