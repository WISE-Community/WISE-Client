'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { AudioOscillatorService } from './audioOscillatorService';
import { AudioOscillatorStudent } from './audio-oscillator-student/audio-oscillator-student.component';

let audioOscillatorComponentModule = angular
  .module('audioOscillatorComponentModule', ['pascalprecht.translate'])
  .service('AudioOscillatorService', downgradeInjectable(AudioOscillatorService))
  .directive(
    'audioOscillatorStudent',
    downgradeComponent({ component: AudioOscillatorStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/audioOscillator/i18n');
    }
  ]);

export default audioOscillatorComponentModule;
