import { Injectable, inject } from '@angular/core';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { ComponentService } from '../componentService';
import { DEFAULT_IDEAS_SUMMARY_GROUPS } from '../common/cRater/CRaterRubric';

@Injectable()
export class DialogGuidanceService extends ComponentService {
  protected type: string = 'DialogGuidance';

  protected computerAvatarService = inject(ComputerAvatarService);

  createComponent() {
    const component: any = super.createComponent();
    component.type = this.type;
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
