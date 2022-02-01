import { Injectable } from '@angular/core';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';
import { ComponentService } from '../componentService';

@Injectable()
export class ShowGroupWorkService extends ComponentService {
  constructor(
    protected studentDataService: StudentDataService,
    protected utilService: UtilService
  ) {
    super(studentDataService, utilService);
  }

  getComponentTypeLabel() {
    return $localize`Show Group Work`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'ShowGroupWork';
    component.showWorkNodeId = '';
    component.showWorkComponentId = '';
    component.peerGroupActivityTag = '';
    component.isShowMyWork = true;
    component.layout = 'column';
    return component;
  }
}
