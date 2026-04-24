import { Injectable } from '@angular/core';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ComponentService } from '../componentService';
import { DEFAULT_IDEAS_SUMMARY_GROUPS } from '../common/cRater/CRaterRubric';

@Injectable()
export class DialogGuidanceService extends ComponentService {
  constructor(protected computerAvatarService: ComputerAvatarService) {
    super();
  }

  getComponentTypeLabel(): string {
    return $localize`Dialog`;
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
    component.cRaterRubric = {
      ideas: [],
      ideaColors: [],
      ideasSummaryGroups: DEFAULT_IDEAS_SUMMARY_GROUPS
    };
    return component;
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
    return componentStates.length > 0;
  }
}
