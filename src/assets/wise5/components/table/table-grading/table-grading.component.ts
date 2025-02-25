import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
    selector: 'table-grading',
    templateUrl: 'table-grading.component.html',
    standalone: false
})
export class TableGradingComponent extends ComponentShowWorkDirective {}
