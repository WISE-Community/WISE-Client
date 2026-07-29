import { Injectable } from '@angular/core';
import { ComponentService } from '../componentService';

@Injectable()
export class ShowMyWorkService extends ComponentService {
  protected type: string = 'ShowMyWork';


  createComponent() {
    const component: any = super.createComponent();
    component.type = this.type;
    component.showWorkNodeId = '';
    component.showWorkComponentId = '';
    return component;
  }
}
