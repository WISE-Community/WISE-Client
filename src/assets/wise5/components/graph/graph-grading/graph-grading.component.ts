import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
    selector: 'graph-grading',
    templateUrl: 'graph-grading.component.html',
    standalone: false
})
export class GraphGradingComponent extends ComponentShowWorkDirective {}
