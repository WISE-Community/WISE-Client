'use strict';

import * as angular from 'angular';
import { NotebookWorkgroupGradingComponent } from './notebook-workgroup-grading/notebook-workgroup-grading.component';
import { downgradeComponent } from '@angular/upgrade/static';

const Notebook = angular
  .module('notebookGrading', [])
  .directive(
    'notebookWorkgroupGrading',
    downgradeComponent({ component: NotebookWorkgroupGradingComponent })
  );

export default Notebook;
