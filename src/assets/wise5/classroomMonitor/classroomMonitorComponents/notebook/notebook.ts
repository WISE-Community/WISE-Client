'use strict';

import NotebookItemGrading from './notebookItemGrading/notebookItemGrading';
import NotebookWorkgroupGrading from './notebookWorkgroupGrading/notebookWorkgroupGrading';
import * as angular from 'angular';

const Notebook = angular
  .module('notebookGrading', [])
  .component('notebookItemGrading', NotebookItemGrading)
  .component('notebookWorkgroupGrading', NotebookWorkgroupGrading);

export default Notebook;
