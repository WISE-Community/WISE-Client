import { Injectable } from '@angular/core';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';
import { ComponentService } from '../componentService';

@Injectable()
export class ShowWorkService extends ComponentService {
  constructor(
    protected studentDataService: StudentDataService,
    protected utilService: UtilService
  ) {
    super(studentDataService, utilService);
  }

  getComponentTypeLabel() {
    return $localize`Show Work`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'ShowWork';
    component.showWorkNodeId = '';
    component.showWorkComponentId = '';
    return component;
  }
}
