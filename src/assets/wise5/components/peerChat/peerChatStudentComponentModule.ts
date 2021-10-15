'use strict';

import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { PeerChatStudentComponent } from './peer-chat-student/peer-chat-student.component';
import { PeerChatService } from './peerChatService';
import { OpenResponseGrading } from '../openResponse/open-response-grading/open-response-grading.component';
import { MultipleChoiceGrading } from '../multipleChoice/multiple-choice-grading/multiple-choice-grading.component';
import { ConceptMapGrading } from '../conceptMap/concept-map-grading/concept-map-grading.component';
import { DrawGrading } from '../draw/draw-grading/draw-grading.component';
import { GraphGrading } from '../graph/graph-grading/graph-grading.component';
import { LabelGrading } from '../label/label-grading/label-grading.component';
import { MatchGrading } from '../match/match-grading/match-grading.component';

const peerChatStudentComponentModule = angular
  .module('peerChatStudentComponentModule', [])
  .service('PeerChatService', downgradeInjectable(PeerChatService))
  .directive(
    'conceptMapGrading',
    downgradeComponent({ component: ConceptMapGrading }) as angular.IDirectiveFactory
  )
  .directive(
    'drawGrading',
    downgradeComponent({ component: DrawGrading }) as angular.IDirectiveFactory
  )
  .directive(
    'graphGrading',
    downgradeComponent({ component: GraphGrading }) as angular.IDirectiveFactory
  )
  .directive(
    'labelGrading',
    downgradeComponent({ component: LabelGrading }) as angular.IDirectiveFactory
  )
  .directive(
    'matchGrading',
    downgradeComponent({ component: MatchGrading }) as angular.IDirectiveFactory
  )
  .directive(
    'multipleChoiceGrading',
    downgradeComponent({ component: MultipleChoiceGrading }) as angular.IDirectiveFactory
  )
  .directive(
    'openResponseGrading',
    downgradeComponent({ component: OpenResponseGrading }) as angular.IDirectiveFactory
  )
  .directive(
    'peerChatStudent',
    downgradeComponent({ component: PeerChatStudentComponent }) as angular.IDirectiveFactory
  );

export default peerChatStudentComponentModule;
