import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
    selector: 'embedded-grading',
    templateUrl: 'embedded-grading.component.html',
    standalone: false
})
export class EmbeddedGradingComponent extends ComponentShowWorkDirective {}
