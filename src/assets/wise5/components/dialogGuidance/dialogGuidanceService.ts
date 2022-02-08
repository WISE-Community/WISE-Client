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
    return component;
  }
}
