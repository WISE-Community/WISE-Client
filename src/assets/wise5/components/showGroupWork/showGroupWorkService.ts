import { Injectable } from '@angular/core';
import { ComponentService } from '../componentService';

@Injectable()
export class ShowGroupWorkService extends ComponentService {
  getComponentTypeLabel() {
    return $localize`Show Group Work`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'ShowGroupWork';
    component.showWorkNodeId = '';
    component.showWorkComponentId = '';
    component.peerGroupingTag = '';
    component.isShowMyWork = true;
    component.layout = 'column';
    return component;
  }
}
