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
import { downgradeComponent } from '@angular/upgrade/static';
import { EditComponentJsonComponent } from '../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentPrompt } from '../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { EditComponentRubricComponent } from '../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../../../app/authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../../../app/authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import WISELinkAuthoringController from '../authoringTool/wiseLink/wiseLinkAuthoringController';
import { EditComponentDefaultFeedback } from '../../../app/authoring-tool/edit-advanced-component/edit-component-default-feedback/edit-component-default-feedback.component';

export default angular
  .module('componentAuthoringModule', [
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
  ])
  .controller('WISELinkAuthoringController', WISELinkAuthoringController)
  .directive(
    'editComponentExcludeFromTotalScore',
    downgradeComponent({
      component: EditComponentExcludeFromTotalScoreComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentDefaultFeedback',
    downgradeComponent({ component: EditComponentDefaultFeedback }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentJson',
    downgradeComponent({ component: EditComponentJsonComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentPrompt',
    downgradeComponent({ component: EditComponentPrompt }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentRubric',
    downgradeComponent({ component: EditComponentRubricComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentSaveButton',
    downgradeComponent({ component: EditComponentSaveButtonComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentSubmitButton',
    downgradeComponent({
      component: EditComponentSubmitButtonComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentTags',
    downgradeComponent({ component: EditComponentTagsComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentWidth',
    downgradeComponent({ component: EditComponentWidthComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentMaxScore',
    downgradeComponent({ component: EditComponentMaxScoreComponent }) as angular.IDirectiveFactory
  );
