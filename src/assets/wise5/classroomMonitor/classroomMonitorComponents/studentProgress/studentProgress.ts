'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { ProjectProgressComponent } from './project-progress/project-progress.component';

const StudentProgress = angular
  .module('studentProgress', [])
  .directive('projectProgress', downgradeComponent({ component: ProjectProgressComponent }));

export default StudentProgress;
