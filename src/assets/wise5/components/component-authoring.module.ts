import * as angular from 'angular';
import './animation/animationAuthoringComponentModule';
import './audioOscillator/audioOscillatorAuthoringComponentModule';
import './conceptMap/conceptMapAuthoringComponentModule';
import './discussion/discussionAuthoringComponentModule';
import './draw/drawAuthoringComponentModule';
import './embedded/embeddedAuthoringComponentModule';
import './graph/graphAuthoringComponentModule';
import './html/htmlAuthoringComponentModule';
import './label/labelAuthoringComponentModule';
import './match/matchAuthoringComponentModule';
import './multipleChoice/multipleChoiceAuthoringComponentModule';
import './openResponse/openResponseAuthoringComponentModule';
import './outsideURL/outsideURLAuthoringComponentModule';
import './summary/summaryAuthoringComponentModule';
import './table/tableAuthoringComponentModule';

export default angular.module('componentAuthoringModule', [
  'animationAuthoringComponentModule',
  'audioOscillatorAuthoringComponentModule',
  'conceptMapAuthoringComponentModule',
  'discussionAuthoringComponentModule',
  'drawAuthoringComponentModule',
  'embeddedAuthoringComponentModule',
  'graphAuthoringComponentModule',
  'htmlAuthoringComponentModule',
  'labelAuthoringComponentModule',
  'matchAuthoringComponentModule',
  'multipleChoiceAuthoringComponentModule',
  'openResponseAuthoringComponentModule',
  'outsideURLAuthoringComponentModule',
  'summaryAuthoringComponentModule',
  'tableAuthoringComponentModule'
]);
