import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'animation-show-work',
  template: `
    @if (numTimesPlayClicked != null) {
      <div><span i18n>Number of Times Animation Played</span>: {{ numTimesPlayClicked }}</div>
    }
  `
})
export class AnimationShowWorkComponent extends ComponentShowWorkDirective {
  protected numTimesPlayClicked: number;

  ngOnInit(): void {
    super.ngOnInit();
    this.numTimesPlayClicked = this.componentState.studentData.numTimesPlayClicked;
  }
}
