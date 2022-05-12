import { Injectable } from '@angular/core';
import { ComponentService } from '../componentService';

@Injectable()
export class ShowMyWorkService extends ComponentService {
  getComponentTypeLabel() {
    return $localize`Show Student Work`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'ShowMyWork';
    component.showWorkNodeId = '';
    component.showWorkComponentId = '';
    return component;
  }
}
