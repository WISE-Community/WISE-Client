import * as angular from 'angular';
import './animation/animationGradingComponentModule';
import './audioOscillator/audioOscillatorGradingComponentModule';
import './conceptMap/conceptMapGradingComponentModule';
import './discussion/discussionGradingComponentModule';
import './draw/drawGradingComponentModule';
import './embedded/embeddedGradingComponentModule';
import './graph/graphGradingComponentModule';
import './label/labelGradingComponentModule';
import './match/matchGradingComponentModule';
import './multipleChoice/multipleChoiceGradingComponentModule';
import './openResponse/openResponseGradingComponentModule';
import './table/tableGradingComponentModule';

export default angular.module('componentGrading', [
  'animationGradingComponentModule',
  'audioOscillatorGradingComponentModule',
  'conceptMapGradingComponentModule',
  'discussionGradingComponentModule',
  'drawGradingComponentModule',
  'embeddedGradingComponentModule',
  'graphGradingComponentModule',
  'labelGradingComponentModule',
  'matchGradingComponentModule',
  'multipleChoiceGradingComponentModule',
  'openResponseGradingComponentModule',
  'tableGradingComponentModule'
]);
