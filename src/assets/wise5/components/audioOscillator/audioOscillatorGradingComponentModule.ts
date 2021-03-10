'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { AudioOscillatorGrading } from './audio-oscillator-grading/audio-oscillator-grading.component';

const audioOscillatorGradingComponentModule = angular
  .module('audioOscillatorGradingComponentModule', ['pascalprecht.translate'])
  .directive(
    'audioOscillatorGrading',
    downgradeComponent({ component: AudioOscillatorGrading }) as angular.IDirectiveFactory
  );

export default audioOscillatorGradingComponentModule;
