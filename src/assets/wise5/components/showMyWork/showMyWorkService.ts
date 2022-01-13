import { Injectable } from '@angular/core';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';
import { ComponentService } from '../componentService';

@Injectable()
export class ShowMyWorkService extends ComponentService {
  constructor(
    protected studentDataService: StudentDataService,
    protected utilService: UtilService
  ) {
    super(studentDataService, utilService);
  }

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
