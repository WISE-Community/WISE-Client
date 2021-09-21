'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { AudioOscillatorService } from './audioOscillatorService';
import { AudioOscillatorAuthoring } from './audio-oscillator-authoring/audio-oscillator-authoring.component';
import { EditAudioOscillatorAdvancedComponent } from './edit-audio-oscillator-advanced/edit-audio-oscillator-advanced.component';

const audioOscillatorAuthoringComponentModule = angular
  .module('audioOscillatorAuthoringComponentModule', [])
  .service('AudioOscillatorService', downgradeInjectable(AudioOscillatorService))
  .directive(
    'audioOscillatorAuthoring',
    downgradeComponent({ component: AudioOscillatorAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editAudioOscillatorAdvanced',
    downgradeComponent({
      component: EditAudioOscillatorAdvancedComponent
    }) as angular.IDirectiveFactory
  );

export default audioOscillatorAuthoringComponentModule;
