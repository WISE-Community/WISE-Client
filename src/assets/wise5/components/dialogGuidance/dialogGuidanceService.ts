import { Injectable } from '@angular/core';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';
import { ComponentService } from '../componentService';

@Injectable()
export class DialogGuidanceService extends ComponentService {
  constructor(
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(StudentDataService, UtilService);
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
      label: $localize`Thought Buddy`,
      prompt: $localize`Discuss your answer with a thought buddy!`,
      initialResponse: $localize`Hi there! It's nice to meet you. What do you think about...`
    };
    return component;
  }
}
