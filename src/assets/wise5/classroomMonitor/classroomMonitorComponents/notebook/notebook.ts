'use strict';

import NotebookItemGrading from './notebookItemGrading/notebookItemGrading';
import * as angular from 'angular';
import { NotebookWorkgroupGradingComponent } from './notebook-workgroup-grading/notebook-workgroup-grading.component';
import { downgradeComponent } from '@angular/upgrade/static';

const Notebook = angular
  .module('notebookGrading', [])
  .component('notebookItemGrading', NotebookItemGrading)
  .directive(
    'notebookWorkgroupGrading',
    downgradeComponent({ component: NotebookWorkgroupGradingComponent })
  );

export default Notebook;
