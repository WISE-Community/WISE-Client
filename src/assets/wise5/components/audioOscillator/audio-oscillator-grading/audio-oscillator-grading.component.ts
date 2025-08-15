import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'audio-oscillator-grading',
  standalone: false,
  template: `
    <audio-oscillator-show-work
      [nodeId]="nodeId"
      [componentId]="componentId"
      [componentState]="componentState"
      [isRevision]="isRevision"
    />
  `
})
export class AudioOscillatorGradingComponent extends ComponentShowWorkDirective {}
