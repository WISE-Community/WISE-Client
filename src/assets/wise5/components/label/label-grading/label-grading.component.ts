import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
    selector: 'label-grading',
    templateUrl: 'label-grading.component.html',
    standalone: false
})
export class LabelGradingComponent extends ComponentShowWorkDirective {}
