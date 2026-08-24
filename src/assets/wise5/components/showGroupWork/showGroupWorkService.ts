import { Injectable } from '@angular/core';
import { ComponentService } from '../componentService';

@Injectable()
export class ShowGroupWorkService extends ComponentService {
  protected type: string = 'ShowGroupWork';


  createComponent() {
    const component: any = super.createComponent();
    component.type = this.type;
    component.showWorkNodeId = '';
    component.showWorkComponentId = '';
    component.peerGroupingTag = '';
    component.isShowMyWork = true;
    component.layout = 'column';
    return component;
  }
}
