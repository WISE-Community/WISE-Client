import { ComponentService } from '../componentService';
import { Injectable } from '@angular/core';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';

@Injectable()
export class HTMLService extends ComponentService {
  constructor(
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(StudentDataService, UtilService);
  }

  getComponentTypeLabel(): string {
    return $localize`Rich Text (HTML)`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'HTML';
    component.html = $localize`Enter html here`;
    return component;
  }

  isCompleted(component: any, componentStates: any[], componentEvents: any[], nodeEvents: any[]) {
    if (nodeEvents != null) {
      for (const nodeEvent of nodeEvents) {
        if (nodeEvent.event === 'nodeEntered') {
          return true;
        }
      }
    }
    return false;
  }

  componentHasWork(component: any) {
    return false;
  }

  componentUsesSaveButton() {
    return false;
  }

  componentUsesSubmitButton() {
    return false;
  }
}
