import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { NodeService } from '../../services/nodeService';
import { VLEProjectService } from '../vleProjectService';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';
import * as hopscotch from 'hopscotch';
window['hopscotch'] = hopscotch;
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { SessionService } from '../../services/sessionService';
import { StudentAssetService } from '../../services/studentAssetService';
import { Directive } from '@angular/core';
import { ComponentService } from '../../components/componentService';
import { filter, take } from 'rxjs/operators';
import { ComponentStateWrapper } from '../../components/ComponentStateWrapper';
import { Node } from '../../common/Node';

@Directive()
class NodeController {
  $translate: any;
  autoSaveInterval: number = 60000; // in milliseconds;
  autoSaveIntervalId: any;
  workComponents: string[] = [
    'Animation',
    'AudioOscillator',
    'ConceptMap',
    'DialogGuidance',
    'Discussion',
    'Draw',
    'Embedded',
    'Graph',
    'Label',
    'Match',
    'MultipleChoice',
    'OpenResponse',
    'Summary',
    'Table'
  ];
  dirtyComponentIds: any = [];
  dirtySubmitComponentIds: any = [];
  endedAndLockedMessage: string;
  isDisabled: boolean;
  isEndedAndLocked: boolean;
  mode: any;
  node: Node;
  nodeContent: any;
  nodeId: string;
  nodeStatus: any;
  rubric: any;
  rubricTour: any;
  saveMessage: any;
  submit: boolean = false;
  subscriptions: Subscription = new Subscription();
  teacherWorkgroupId: number;
  workgroupId: number;

  static $inject = [
    '$compile',
    '$filter',
    '$q',
    '$scope',
    '$state',
    '$timeout',
    'AnnotationService',
    'ComponentService',
    'ConfigService',
    'NodeService',
    'ProjectService',
    'SessionService',
    'StudentAssetService',
    'StudentDataService',
    'UtilService'
  ];

  constructor(
    private $compile: any,
    $filter: any,
    private $q: any,
    private $scope: any,
    private $state: any,
    private $timeout: any,
    private AnnotationService: AnnotationService,
    private ComponentService: ComponentService,
    private ConfigService: ConfigService,
    private NodeService: NodeService,
    private ProjectService: VLEProjectService,
    private SessionService: SessionService,
    private StudentAssetService: StudentAssetService,
    private StudentDataService: StudentDataService,
    private UtilService: UtilService
  ) {
    this.$translate = $filter('translate');
  }

  $onInit() {
    this.workgroupId = this.ConfigService.getWorkgroupId();
    this.teacherWorkgroupId = this.ConfigService.getTeacherWorkgroupId();
    this.isDisabled = !this.ConfigService.isRunActive();

    this.isEndedAndLocked = this.ConfigService.isEndedAndLocked();
    if (this.isEndedAndLocked) {
      const endDate = this.ConfigService.getPrettyEndDate();
      this.endedAndLockedMessage = this.$translate('endedAndLockedMessage', { endDate: endDate });
    }

    this.saveMessage = {
      text: '',
      time: ''
    };

    this.rubric = null;
    this.mode = this.ConfigService.getMode();
    this.nodeId = this.StudentDataService.getCurrentNodeId();
    this.node = this.ProjectService.getNode(this.nodeId);
    this.nodeContent = this.ProjectService.getNodeById(this.nodeId);
    this.nodeStatus = this.StudentDataService.nodeStatuses[this.nodeId];
    this.startAutoSaveInterval();
    this.registerExitListener();

    if (
      this.NodeService.currentNodeHasTransitionLogic() &&
      this.NodeService.evaluateTransitionLogicOn('enterNode')
    ) {
      this.NodeService.evaluateTransitionLogic();
    }

    // set save message with last save/submission
    // for now, we'll use the latest component state (since we don't currently keep track of node-level saves)
    // TODO: use node states once we implement node state saving
    const latestComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId
    );
    if (latestComponentState) {
      const latestClientSaveTime = latestComponentState.clientSaveTime;
      if (latestComponentState.isSubmit) {
        this.setSubmittedMessage(latestClientSaveTime);
      } else {
        this.setSavedMessage(latestClientSaveTime);
      }
    }

    const nodeId = this.nodeId;
    const componentId = null;
    const componentType = null;
    const category = 'Navigation';
    const event = 'nodeEntered';
    const eventData = {
      nodeId: nodeId
    };
    this.StudentDataService.saveVLEEvent(
      nodeId,
      componentId,
      componentType,
      category,
      event,
      eventData
    );

    this.rubric = this.node.rubric;
    this.createRubricTour();

    if (
      this.$state != null &&
      this.$state.params != null &&
      this.$state.params.componentId != null
    ) {
      const componentId = this.$state.params.componentId;
      this.scrollAndHighlightComponent(componentId);
    }

    this.subscriptions.add(
      this.StudentDataService.componentSaveTriggered$.subscribe(({ nodeId, componentId }) => {
        if (nodeId == this.node.id && this.node.hasComponent(componentId)) {
          const isAutoSave = false;
          this.createAndSaveComponentData(isAutoSave, componentId);
        }
      })
    );

    this.subscriptions.add(
      this.StudentDataService.componentSubmitTriggered$.subscribe(({ nodeId, componentId }) => {
        if (nodeId == this.node.id && this.node.hasComponent(componentId)) {
          const isAutoSave = false;
          const isSubmit = true;
          this.createAndSaveComponentData(isAutoSave, componentId, isSubmit);
        }
      })
    );

    this.subscriptions.add(
      this.StudentDataService.componentStudentData$.subscribe((componentStudentData: any) => {
        const componentId = componentStudentData.componentId;
        const componentState = componentStudentData.componentState;
        if (componentState.nodeId == null) {
          if (componentStudentData.nodeId != null) {
            componentState.nodeId = componentStudentData.nodeId;
          }
        }
        if (componentState.componentId == null) {
          if (componentStudentData.componentId != null) {
            componentState.componentId = componentStudentData.componentId;
          }
        }
        this.notifyConnectedParts(componentId, componentState);
      })
    );

    this.subscriptions.add(
      this.StudentDataService.componentDirty$.subscribe(({ componentId, isDirty }) => {
        const index = this.dirtyComponentIds.indexOf(componentId);
        if (isDirty && index === -1) {
          this.dirtyComponentIds.push(componentId);
        } else if (!isDirty && index > -1) {
          this.dirtyComponentIds.splice(index, 1);
        }
      })
    );

    this.subscriptions.add(
      this.StudentDataService.componentSubmitDirty$.subscribe(({ componentId, isDirty }) => {
        const index = this.dirtySubmitComponentIds.indexOf(componentId);
        if (isDirty && index === -1) {
          this.dirtySubmitComponentIds.push(componentId);
        } else if (!isDirty && index > -1) {
          this.dirtySubmitComponentIds.splice(index, 1);
        }
      })
    );

    this.subscriptions.add(
      this.NodeService.showRubric$.subscribe((id: string) => {
        this.showRubric(id);
      })
    );

    const script = this.nodeContent.script;
    if (script != null) {
      this.ProjectService.retrieveScript(script).then((script: string) => {
        new Function(script).call(this);
      });
    }

    this.$scope.$on('$destroy', () => {
      this.ngOnDestroy();
    });
  }

  ngOnDestroy() {
    this.stopAutoSaveInterval();
    this.nodeUnloaded(this.nodeId);
    if (
      this.NodeService.currentNodeHasTransitionLogic() &&
      this.NodeService.evaluateTransitionLogicOn('exitNode')
    ) {
      this.NodeService.evaluateTransitionLogic();
    }
    this.subscriptions.unsubscribe();
  }

  createRubricTour() {
    this.rubricTour = {
      id: 'rubricTour',
      arrowWidth: 12,
      bubblePadding: 0,
      bubbleWidth: 800,
      container: '#content',
      steps: [],
      showPrevButton: true,
      showNextButton: true,
      scrollDuration: 400,
      customRenderer: this.getRubricTemplate,
      customData: {
        $ctrl: this
      },
      i18n: {
        nextBtn: this.$translate('NEXT'),
        prevBtn: this.$translate('PREVIOUS'),
        doneBtn: this.$translate('DONE'),
        closeTooltip: this.$translate('CLOSE')
      }
    };

    if (this.rubric) {
      const thisTarget = '#nodeRubric_' + this.nodeId;
      const content = this.UtilService.insertWISELinks(
        this.ProjectService.replaceAssetPaths(this.rubric)
      );
      // add a tour bubble for the node rubric
      this.rubricTour.steps.push({
        target: thisTarget,
        placement: 'bottom',
        title: this.$translate('STEP_INFO'),
        content: content,
        xOffset: 'center',
        arrowOffset: 'center',
        onShow: this.onShowRubric,
        viewed: false
      });
    }

    // add tour bubbles for each of the component rubrics
    for (const component of this.getComponents()) {
      if (component.rubric) {
        const thisTarget = '#rubric_' + component.id;
        const content = this.UtilService.insertWISELinks(
          this.ProjectService.replaceAssetPaths(component.rubric)
        );
        this.rubricTour.steps.push({
          target: thisTarget,
          arrowOffset: 21,
          placement: 'right',
          yOffset: 1,
          title: this.$translate('ITEM_INFO'),
          content: content,
          onShow: this.onShowRubric,
          viewed: false
        });
      }
    }
  }

  showRubric(id) {
    if (this.rubricTour) {
      let step = -1;
      let index = 0;
      if (id === this.nodeId) {
        step = index;
      }

      if (step < 0) {
        if (this.rubric) {
          index++;
        }
        for (const component of this.getComponents()) {
          if (component.rubric) {
            if (component.id === id) {
              step = index;
              break;
            }
            index++;
          }
        }
      }
      hopscotch.endTour(this.rubricTour);
      hopscotch.startTour(this.rubricTour, step);
    }
  }

  scrollAndHighlightComponent(componentId) {
    this.$timeout(() => {
      const componentElement = $('#component_' + componentId);
      if (componentElement != null) {
        const originalBackgroundColor = componentElement.css('backgroundColor');
        componentElement.css('background-color', '#FFFF9C');
        $('#content').animate(
          {
            scrollTop: componentElement.prop('offsetTop')
          },
          1000
        );

        /*
         * remove the background highlighting so that it returns
         * to its original color
         */
        componentElement.css({
          transition: 'background-color 3s ease-in-out',
          'background-color': originalBackgroundColor
        });
      }
    }, 1000);
  }

  /**
   * Create and return the custom template for the rubric tour bubbles
   * @param details Object with the tour details
   * @return HTML string
   */
  getRubricTemplate(details) {
    const i18n = details.i18n;
    const buttons = details.buttons;
    const step = details.step;
    const tour = details.tour;
    const $ctrl = tour.customData.$ctrl;
    const template = `<div class="hopscotch-bubble-container help-bubble md-whiteframe-4dp" style="width: ${
      step.width
    }px; padding: ${step.padding}px;">
                <md-toolbar class="md-subhead help-bubble__title md-toolbar--wise">
                    <div class="help-bubble___title__content" layout="row" layout-align="start center" flex>
                        <span>${tour.isTour ? `${i18n.stepNum} | ` : ''}${
      step.title !== '' ? `${step.title}` : ''
    }</span>
                        <span flex></span>
                        ${
                          buttons.showClose
                            ? `<md-button class="md-icon-button hopscotch-close">
                            <md-icon aria-label="${i18n.closeTooltip}"> close </md-icon>
                        </md-button>`
                            : ''
                        }
                    </div>
                </md-toolbar>
                <div class="help-bubble__content">
                    ${step.content !== '' ? `${step.content}` : ''}
                    ${
                      buttons.showCTA
                        ? `<md-button class="hopscotch-cta md-primary md-raised">${i18n.ctaLabel}</md-button>`
                        : ''
                    }
                </div>
                <md-divider></md-divider>
                <div class="help-bubble__actions gray-lightest-bg" layout="row" layout-align="start center">
                    ${
                      buttons.showClose
                        ? `<md-button class="button--small hopscotch-close">${i18n.closeTooltip}</md-button>`
                        : ''
                    }
                    <span flex></span>
                    ${
                      buttons.showPrev
                        ? `<md-button class="button--small info hopscotch-prev">${i18n.prevBtn}</md-button>`
                        : ''
                    }
                    ${
                      buttons.showNext
                        ? `<md-button class="button--small info hopscotch-next">${i18n.nextBtn}</md-button>`
                        : ''
                    }
                </md-card-actions>
            </div>`;

    // need to compile the template here because Hopscotch inserts raw html
    const templateHTML =
      $ctrl.$compile(template)($ctrl.$scope)[0].outerHTML +
      `<div class="hopscotch-bubble-arrow-container hopscotch-arrow">
                <div class="hopscotch-bubble-arrow-border"></div>
                <div class="hopscotch-bubble-arrow"></div>
            </div>`;
    return templateHTML;
  }

  onShowRubric() {
    // stop the pulsing animation on the info button for the rubric being shown
    const index = hopscotch.getCurrStepNum();
    hopscotch.getCurrTour().customData.$ctrl.rubricTour.steps[index].viewed = true;
  }

  isShowNodeRubric() {
    return this.rubric != null && this.rubric != '' && this.mode === 'preview';
  }

  isShowComponentRubric(component) {
    return component.rubric != null && component.rubric != '' && this.mode === 'preview';
  }

  setStudentWork() {}

  importWork() {}

  saveButtonClicked() {
    const isAutoSave = false;
    this.createAndSaveComponentData(isAutoSave);
  }

  submitButtonClicked() {
    this.NodeService.broadcastNodeSubmitClicked({ nodeId: this.nodeId });
    const isAutoSave = false;
    const isSubmit = true;
    this.createAndSaveComponentData(isAutoSave, null, isSubmit);
  }

  getComponents(): any[] {
    return this.node.components.map((component) => {
      if (this.isDisabled) {
        component.isDisabled = true;
      }
      return component;
    });
  }

  getComponentTemplatePath(componentType) {
    return this.NodeService.getComponentTemplatePath(componentType);
  }

  setSavedMessage(time) {
    this.setSaveText(this.$translate('SAVED'), time);
  }

  setAutoSavedMessage(time) {
    this.setSaveText(this.$translate('AUTO_SAVED'), time);
  }

  setSubmittedMessage(time) {
    this.setSaveText(this.$translate('SUBMITTED'), time);
  }

  setSaveText(message, time) {
    this.saveMessage.text = message;
    this.saveMessage.time = time;
  }

  clearSaveText() {
    this.setSaveText('', null);
  }

  startAutoSaveInterval() {
    this.autoSaveIntervalId = setInterval(() => {
      if (this.dirtyComponentIds.length) {
        const isAutoSave = true;
        this.createAndSaveComponentData(isAutoSave);
      }
    }, this.autoSaveInterval);
  }

  stopAutoSaveInterval() {
    clearInterval(this.autoSaveIntervalId);
  }

  /**
   * Obtain the componentStates and annotations from the children and save them
   * to the server
   * @param isAutoSave whether the component states were auto saved
   * @param componentId (optional) the component id of the component
   * that triggered the save
   * @param isSubmit (optional) whether this is a submit or not
   * @returns a promise that will save all the component states for the step
   * that needs saving
   */
  createAndSaveComponentData(isAutoSave, componentId = null, isSubmit = null) {
    return this.createComponentStates(isAutoSave, componentId, isSubmit).then(
      (componentStatesFromComponents) => {
        if (this.UtilService.arrayHasNonNullElement(componentStatesFromComponents)) {
          const {
            componentStates,
            componentEvents,
            componentAnnotations
          } = this.getDataArraysToSaveFromComponentStates(componentStatesFromComponents);
          componentStates.forEach((componentState: any) => {
            this.notifyConnectedParts(componentId, componentState);
          });
          return this.StudentDataService.saveToServer(
            componentStates,
            componentEvents,
            componentAnnotations
          ).then((savedStudentDataResponse) => {
            if (savedStudentDataResponse) {
              if (this.NodeService.currentNodeHasTransitionLogic()) {
                if (this.NodeService.evaluateTransitionLogicOn('studentDataChanged')) {
                  this.NodeService.evaluateTransitionLogic();
                }
                if (this.NodeService.evaluateTransitionLogicOn('scoreChanged')) {
                  if (componentAnnotations != null && componentAnnotations.length > 0) {
                    let evaluateTransitionLogic = false;
                    for (const componentAnnotation of componentAnnotations) {
                      if (componentAnnotation != null) {
                        if (componentAnnotation.type === 'autoScore') {
                          evaluateTransitionLogic = true;
                        }
                      }
                    }
                    if (evaluateTransitionLogic) {
                      this.NodeService.evaluateTransitionLogic();
                    }
                  }
                }
              }
              const studentWorkList = savedStudentDataResponse.studentWorkList;
              if (!componentId && studentWorkList && studentWorkList.length) {
                const latestStudentWork = studentWorkList[studentWorkList.length - 1];
                const serverSaveTime = latestStudentWork.serverSaveTime;
                const clientSaveTime = this.ConfigService.convertToClientTimestamp(serverSaveTime);
                if (isAutoSave) {
                  this.setAutoSavedMessage(clientSaveTime);
                } else if (isSubmit) {
                  this.setSubmittedMessage(clientSaveTime);
                } else {
                  this.setSavedMessage(clientSaveTime);
                }
              } else {
                this.clearSaveText();
              }
            }
            return savedStudentDataResponse;
          });
        }
      }
    );
  }

  getDataArraysToSaveFromComponentStates(componentStates) {
    return {
      componentStates: componentStates,
      componentEvents: [],
      componentAnnotations: this.getAnnotationsFromComponentStates(componentStates)
    };
  }

  getAnnotationsFromComponentStates(componentStates) {
    const componentAnnotations = [];
    for (const componentState of componentStates) {
      const annotations = componentState.annotations;
      if (annotations != null) {
        componentAnnotations.push(...annotations);
      }
      delete componentState.annotations;
    }
    return componentAnnotations;
  }

  /**
   * Loop through this node's components and get/create component states
   * @param isAutoSave whether the component states were auto saved
   * @param componentId (optional) the component id of the component that triggered the save
   * @param isSubmit (optional) whether this is a submission or not
   * @returns an array of promises that will return component states
   */
  createComponentStates(
    isAutoSave: boolean = false,
    componentId: string,
    isSubmit: boolean = false
  ): any {
    const components = this.getComponentsToSave(componentId);
    const componentStatePromises = this.getComponentStatePromises(components, isAutoSave, isSubmit);
    return this.$q.all(componentStatePromises).then((componentStatesFromComponents: any[]) => {
      return componentStatesFromComponents.filter((componentState: any) => componentState != null);
    });
  }

  getComponentsToSave(componentId: string): any {
    if (componentId) {
      const components = [];
      const component = this.node.getComponent(componentId);
      if (component) {
        components.push(component);
      }
      return components;
    } else {
      return this.getComponents();
    }
  }

  getComponentStatePromises(
    components: any[],
    isAutoSave: boolean = false,
    isSubmit: boolean = false
  ): any[] {
    const componentStatePromises = [];
    for (const component of components) {
      const componentId = component.id;
      const componentType = component.type;
      if (this.workComponents.includes(componentType)) {
        componentStatePromises.push(
          this.getComponentStatePromiseFromService(this.nodeId, componentId, isAutoSave, isSubmit)
        );
        this.ComponentService.requestComponentState(this.nodeId, componentId, isSubmit);
      }
    }
    return componentStatePromises;
  }

  getComponentStatePromiseFromService(
    nodeId: string,
    componentId: string,
    isAutoSave: boolean = false,
    isSubmit: boolean = false
  ): Promise<any> {
    const componentStatePromise = this.getComponentStatePromise(
      nodeId,
      componentId,
      isAutoSave,
      isSubmit
    );
    return componentStatePromise;
  }

  getComponentStatePromise(
    nodeId: string,
    componentId: string,
    isAutoSave: boolean = false,
    isSubmit: boolean = false
  ): Promise<any> {
    return new Promise((resolve) => {
      this.ComponentService.sendComponentStateSource$
        .pipe(
          filter((data: any) => {
            return data.nodeId === nodeId && data.componentId === componentId;
          }),
          take(1)
        )
        .toPromise()
        .then((componentStateWrapper: ComponentStateWrapper) => {
          this.resolveComponentStatePromise(
            resolve,
            componentStateWrapper.componentStatePromise,
            isAutoSave,
            isSubmit
          );
        });
    });
  }

  resolveComponentStatePromise(
    resolve: any,
    componentStatePromise: Promise<any>,
    isAutoSave: boolean = false,
    isSubmit: boolean = false
  ): void {
    componentStatePromise.then((componentState: any) => {
      if (componentState == null) {
        resolve(null);
      } else {
        this.injectAdditionalComponentStateFields(componentState, isAutoSave, isSubmit);
        resolve(componentState);
      }
    });
  }

  injectAdditionalComponentStateFields(
    componentState: any,
    isAutoSave: boolean = false,
    isSubmit: boolean = false
  ): any {
    componentState.runId = this.ConfigService.getRunId();
    componentState.periodId = this.ConfigService.getPeriodId();
    componentState.workgroupId = this.ConfigService.getWorkgroupId();
    componentState.isAutoSave = isAutoSave === true;
    componentState.isSubmit ??= isSubmit;
  }

  /**
   * Get the latest annotations for a given component
   * TODO: move to a parent component class in the future?
   * @param componentId the component's id
   * @return object containing the component's latest score and comment annotations
   */
  getLatestComponentAnnotations(componentId) {
    let latestScoreAnnotation = null;
    let latestCommentAnnotation = null;
    let nodeId = this.nodeId;
    let workgroupId = this.workgroupId;
    latestScoreAnnotation = this.AnnotationService.getLatestScoreAnnotation(
      nodeId,
      componentId,
      workgroupId,
      'any'
    );
    latestCommentAnnotation = this.AnnotationService.getLatestCommentAnnotation(
      nodeId,
      componentId,
      workgroupId,
      'any'
    );
    return {
      score: latestScoreAnnotation,
      comment: latestCommentAnnotation
    };
  }

  /**
   * Notify any connected components that the student data has changed
   * @param componentId the component id that has changed
   * @param componentState the new component state
   */
  notifyConnectedParts(changedComponentId, componentState) {
    for (const component of this.getComponents()) {
      if (component.connectedComponents != null) {
        for (const connectedComponent of component.connectedComponents) {
          if (
            connectedComponent.nodeId === componentState.nodeId &&
            connectedComponent.componentId === componentState.componentId
          ) {
            this.ComponentService.notifyConnectedComponentSubscribers(
              this.nodeId,
              component.id,
              componentState
            );
          }
        }
      }
    }
  }

  getComponentStateByComponentId(componentId: string): any {
    return this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      componentId
    );
  }

  nodeUnloaded(nodeId) {
    hopscotch.endTour(this.rubricTour);
    const isAutoSave = true;
    this.createAndSaveComponentData(isAutoSave);
    const componentId = null;
    const componentType = null;
    const category = 'Navigation';
    const event = 'nodeExited';
    const eventData = {
      nodeId: nodeId
    };
    this.StudentDataService.saveVLEEvent(
      nodeId,
      componentId,
      componentType,
      category,
      event,
      eventData
    );
  }

  getSubmitDirty() {
    for (const component of this.getComponents()) {
      const latestState = this.getComponentStateByComponentId(component.id);
      if (latestState && !latestState.isSubmit) {
        return true;
      }
    }
    return false;
  }

  registerExitListener() {
    this.subscriptions.add(
      this.SessionService.exit$.subscribe(() => {
        this.stopAutoSaveInterval();
        this.nodeUnloaded(this.nodeId);
      })
    );
  }
}

export default NodeController;
