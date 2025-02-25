import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
    selector: 'open-response-grading',
    templateUrl: 'open-response-grading.component.html',
    standalone: false
})
export class OpenResponseGradingComponent extends ComponentShowWorkDirective {}
