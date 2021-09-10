import { Component } from '@angular/core';
import { ComponentGrading } from '../../../classroomMonitor/classroomMonitorComponents/shared/component-grading.component';
import { DialogResponse } from '../DialogResponse';

@Component({
  selector: 'dialog-guidance-grading',
  templateUrl: './dialog-guidance-grading.component.html',
  styleUrls: ['./dialog-guidance-grading.component.scss']
})
export class DialogGuidanceGradingComponent extends ComponentGrading {
  responses: DialogResponse[];

  ngOnInit(): void {
    this.responses = this.componentState.studentData.responses;
  }
}
