import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
    selector: 'concept-map-grading',
    templateUrl: 'concept-map-grading.component.html',
    standalone: false
})
export class ConceptMapGradingComponent extends ComponentShowWorkDirective {}
