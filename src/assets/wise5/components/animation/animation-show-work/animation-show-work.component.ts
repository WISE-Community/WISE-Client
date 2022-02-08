import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'animation-show-work',
  templateUrl: 'animation-show-work.component.html'
})
export class AnimationShowWorkComponent extends ComponentShowWorkDirective {
  numTimesPlayClicked: number;

  ngOnInit() {
    super.ngOnInit();
    this.numTimesPlayClicked = this.componentState.studentData.numTimesPlayClicked;
  }
}
