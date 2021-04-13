'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { MultipleChoiceService } from './multipleChoiceService';
import { MultipleChoiceStudent } from './multiple-choice-student/multiple-choice-student.component';

let multipleChoiceComponentModule = angular
  .module('multipleChoiceComponentModule', ['pascalprecht.translate'])
  .service('MultipleChoiceService', downgradeInjectable(MultipleChoiceService))
  .directive(
    'multipleChoiceStudent',
    downgradeComponent({ component: MultipleChoiceStudent }) as angular.IDirectiveFactory
  )
  .config([
    '$translatePartialLoaderProvider',
    ($translatePartialLoaderProvider) => {
      $translatePartialLoaderProvider.addPart('components/multipleChoice/i18n');
    }
  ]);

export default multipleChoiceComponentModule;
