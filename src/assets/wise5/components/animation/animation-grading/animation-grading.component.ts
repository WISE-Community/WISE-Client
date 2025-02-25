import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
    selector: 'animation-grading',
    templateUrl: 'animation-grading.component.html',
    standalone: false
})
export class AnimationGradingComponent extends ComponentShowWorkDirective {}
