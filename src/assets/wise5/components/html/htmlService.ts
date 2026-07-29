import { ComponentService } from '../componentService';
import { Injectable } from '@angular/core';

@Injectable()
export class HTMLService extends ComponentService {
  protected type: string = 'HTML';


  createComponent() {
    const component: any = super.createComponent();
    component.type = this.type;
    component.html = $localize`Enter content here`;
    return component;
  }

  isCompleted(component: any, componentStates: any[], nodeEvents: any[], node: any) {
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
