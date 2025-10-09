import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'animation-show-work',
  template: `
    @if (playCount != null) {
      <div><span i18n>Number of Times Animation Played</span>: {{ playCount }}</div>
    }
  `
})
export class AnimationShowWorkComponent extends ComponentShowWorkDirective {
  protected playCount: number;

  ngOnInit(): void {
    super.ngOnInit();
    this.playCount = this.componentState.studentData.numTimesPlayClicked;
  }
}
