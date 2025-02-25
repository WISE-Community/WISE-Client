import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
    selector: 'audio-oscillator-grading',
    templateUrl: 'audio-oscillator-grading.component.html',
    standalone: false
})
export class AudioOscillatorGradingComponent extends ComponentShowWorkDirective {}
