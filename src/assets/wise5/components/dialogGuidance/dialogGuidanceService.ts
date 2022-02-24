import { Injectable } from '@angular/core';
import { ComputerAvatarService } from '../../services/computerAvatarService';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';
import { ComponentService } from '../componentService';

@Injectable()
export class DialogGuidanceService extends ComponentService {
  constructor(
    protected computerAvatarService: ComputerAvatarService,
    protected studentDataService: StudentDataService,
    protected utilService: UtilService
  ) {
    super(studentDataService, utilService);
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
    component.computerAvatarSettings = {
      ids: this.computerAvatarService.getAvatars().map((avatar) => avatar.id),
      label: $localize`Thought Buddy`,
      prompt: $localize`Discuss your answer with a thought buddy!`,
      initialResponse: $localize`Hi there! It's nice to meet you. What do you think about...`
    };
    return component;
  }
}
