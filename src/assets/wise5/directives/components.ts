'use strict';

import * as angular from 'angular';
import Compile from './compile/compile';
import DisableDeleteKeypress from './disableDeleteKeypress/disableDeleteKeypress';
import Draggable from './draggable/draggable';
import Sticky from './sticky/sticky';

const Components = angular.module('components', []);
Components.component('compile', Compile);
Components.component('disableDeleteKeypress', DisableDeleteKeypress);
Components.component('draggable', Draggable);
Components.directive('sticky', Sticky);

export default Components;
