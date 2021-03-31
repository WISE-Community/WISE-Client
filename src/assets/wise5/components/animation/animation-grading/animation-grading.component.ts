import { Component } from '@angular/core';
import { ComponentGrading } from '../../../classroomMonitor/classroomMonitorComponents/shared/component-grading.component';

@Component({
  selector: 'animation-grading',
  templateUrl: 'animation-grading.component.html'
})
export class AnimationGrading extends ComponentGrading {
  numTimesPlayClicked: number;

  ngOnInit() {
    super.ngOnInit();
    this.numTimesPlayClicked = this.componentState.studentData.numTimesPlayClicked;
  }
}
