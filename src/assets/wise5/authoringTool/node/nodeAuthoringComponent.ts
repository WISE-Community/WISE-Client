'use strict';

import { TeacherProjectService } from '../../services/teacherProjectService';
import { ConfigService } from '../../services/configService';
import { CopyComponentService } from '../../services/copyComponentService';
import { InsertComponentService } from '../../services/insertComponentService';
import { NodeService } from '../../services/nodeService';
import { TeacherDataService } from '../../services/teacherDataService';
import * as $ from 'jquery';
import { NotificationService } from '../../services/notificationService';
import { Subscription } from 'rxjs';
import { Directive } from '@angular/core';
import { Node } from '../../common/Node';
import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { ComponentTypeService } from '../../services/componentTypeService';
import { ComponentContent } from '../../common/ComponentContent';
import { Component } from '../../common/Component';
import { copy } from '../../common/object/object';
import { temporarilyHighlightElement } from '../../common/dom/dom';

@Directive()
class NodeAuthoringController {
  $translate: any;
  components: any;
  componentsToChecked = {};
  copyComponentMode: boolean = false;
  currentNodeCopy: any;
  howToChooseAmongAvailablePathsOptions = [
    null,
    'random',
    'workgroupId',
    'firstAvailable',
    'lastAvailable',
    'tag'
  ];
  insertComponentMode: boolean = false;
  isAnyComponentSelected: boolean = false;
  isGroupNode: boolean;
  items: any[];
  moveComponentMode: boolean = false;
  node: Node;
  nodeJson: any;
  nodeCopy: any = null;
  nodeId: string;
  nodePosition: any;
  originalNodeCopy: any;
  projectId: number;
  selectedComponent: any = null;
  showAdvanced: boolean = false;
  showComponentAuthoringViews: boolean = true;
  showComponents: boolean = true;
  showStepButtons: boolean = true;
  undoStack: any[] = [];
  subscriptions: Subscription = new Subscription();

  static $inject = [
    '$anchorScroll',
    '$filter',
    '$mdDialog',
    '$state',
    '$stateParams',
    '$timeout',
    'ConfigService',
    'CopyComponentService',
    'ComponentServiceLookupService',
    'ComponentTypeService',
    'InsertComponentService',
    'NodeService',
    'NotificationService',
    'ProjectService',
    'TeacherDataService'
  ];

  constructor(
    private $anchorScroll: any,
    $filter: any,
    private $mdDialog: any,
    private $state: any,
    private $stateParams: any,
    private $timeout: any,
    private ConfigService: ConfigService,
    private CopyComponentService: CopyComponentService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private componentTypeService: ComponentTypeService,
    private InsertComponentService: InsertComponentService,
    private NodeService: NodeService,
    private NotificationService: NotificationService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {
    this.$translate = $filter('translate');
  }

  $onInit() {
    this.nodeId = this.node.id;
    this.isGroupNode = this.node.isGroup();
    this.TeacherDataService.setCurrentNodeByNodeId(this.nodeId);
    this.nodeJson = this.ProjectService.getNodeById(this.nodeId);
    this.nodePosition = this.ProjectService.getNodePositionById(this.nodeId);
    this.components = this.ProjectService.getComponents(this.nodeId);

    /*
     * remember a copy of the node at the beginning of this node authoring
     * session in case we need to roll back if the user decides to
     * cancel/revert all the changes.
     */
    this.originalNodeCopy = copy(this.nodeJson);
    this.currentNodeCopy = copy(this.nodeJson);

    this.subscriptions.add(
      this.NodeService.componentShowSubmitButtonValueChanged$.subscribe(({ showSubmitButton }) => {
        if (showSubmitButton) {
          this.nodeJson.showSaveButton = false;
          this.nodeJson.showSubmitButton = false;
          this.ProjectService.turnOnSaveButtonForAllComponents(this.nodeJson);
        } else {
          if (this.ProjectService.doesAnyComponentInNodeShowSubmitButton(this.nodeJson.id)) {
            this.ProjectService.turnOnSaveButtonForAllComponents(this.nodeJson);
          } else {
            this.nodeJson.showSaveButton = true;
            this.nodeJson.showSubmitButton = false;
            this.ProjectService.turnOffSaveButtonForAllComponents(this.nodeJson);
          }
        }
        this.authoringViewNodeChanged();
      })
    );

    const data = {
      title: this.ProjectService.getNodePositionAndTitle(this.nodeId)
    };
    if (this.isGroupNode) {
      this.saveEvent('activityViewOpened', 'Navigation', data);
    } else {
      this.saveEvent('stepViewOpened', 'Navigation', data);
    }
    if (this.$stateParams.newComponents.length > 0) {
      this.highlightNewComponentsAndThenShowComponentAuthoring(this.$stateParams.newComponents);
    } else {
      this.scrollToTopOfPage();
    }
    this.subscriptions.add(
      this.ProjectService.nodeChanged$.subscribe((doParseProject) => {
        this.authoringViewNodeChanged(doParseProject);
      })
    );
  }

  $onDestroy() {
    this.TeacherDataService.setCurrentNode(null);
    this.subscriptions.unsubscribe();
  }

  protected previewStepInNewWindow(constraints: boolean): void {
    this.saveStepPreviewedEvent(constraints);
    window.open(this.createPreviewURL(this.nodeId, constraints));
  }

  private saveStepPreviewedEvent(constraints: boolean): void {
    const data = { constraints: constraints };
    this.saveEvent('stepPreviewed', 'Navigation', data);
  }

  private createPreviewURL(nodeId: string, constraints: boolean): string {
    let previewURL = `${this.ConfigService.getConfigParam('previewProjectURL')}/${nodeId}`;
    if (!constraints) {
      previewURL += '?constraints=false';
    }
    return previewURL;
  }

  close() {
    this.TeacherDataService.setCurrentNode(null);
    this.scrollToTopOfPage();
  }

  showSaveErrorAdvancedAuthoring() {
    alert(this.$translate('saveErrorAdvancedAuthoring'));
  }

  addComponent() {
    this.$state.go('root.at.project.node.add-component.choose-component');
  }

  deleteComponent(componentId) {
    if (confirm(this.$translate('confirmDeleteComponent'))) {
      this.ProjectService.deleteComponent(this.nodeId, componentId);
      this.checkIfNeedToShowNodeSaveOrNodeSubmitButtons();
      this.ProjectService.saveProject();
    }
  }

  hideAllComponentSaveButtons() {
    for (const component of this.components) {
      const service = this.componentServiceLookupService.getService(component.type);
      if (service.componentUsesSaveButton()) {
        component.showSaveButton = false;
      }
    }
  }

  /**
   * The node has changed in the authoring view
   * @param parseProject whether to parse the whole project to recalculate
   * significant changes such as branch paths
   */
  authoringViewNodeChanged(parseProject = false) {
    this.undoStack.push(this.currentNodeCopy);
    this.currentNodeCopy = copy(this.nodeJson);
    if (parseProject) {
      this.ProjectService.parseProject();
      this.items = this.ProjectService.idToOrder;
    }
    return this.ProjectService.saveProject();
  }

  undo() {
    if (this.undoStack.length === 0) {
      alert(this.$translate('noUndoAvailable'));
    } else if (this.undoStack.length > 0) {
      if (confirm(this.$translate('confirmUndoLastChange'))) {
        const nodePreviousVersion = this.undoStack.pop();
        this.ProjectService.replaceNode(this.nodeId, nodePreviousVersion);
        this.nodeJson = this.ProjectService.getNodeById(this.nodeId);
        this.components = this.ProjectService.getComponents(this.nodeId);
        this.ProjectService.saveProject();
      }
    }
  }

  hideAllViews() {
    this.showStepButtons = false;
    this.showComponents = false;
    this.NotificationService.hideJSONValidMessage();
  }

  showDefaultComponentsView() {
    this.hideAllViews();
    this.showStepButtons = true;
    this.showComponents = true;
  }

  showAdvancedView() {
    this.$state.go('root.at.project.node.advanced');
  }

  editRubric() {
    this.$state.go('root.at.project.node.edit-rubric');
  }

  showComponentAuthoring() {
    this.showComponentAuthoringViews = true;
  }

  hideComponentAuthoring() {
    this.showComponentAuthoringViews = false;
  }

  turnOnInsertComponentMode() {
    this.insertComponentMode = true;
  }

  turnOffInsertComponentMode() {
    this.insertComponentMode = false;
  }

  turnOnMoveComponentMode() {
    this.moveComponentMode = true;
  }

  turnOffMoveComponentMode() {
    this.moveComponentMode = false;
  }

  turnOnCopyComponentMode() {
    this.copyComponentMode = true;
  }

  turnOffCopyComponentMode() {
    this.copyComponentMode = false;
  }

  getSelectedComponentIds() {
    const selectedComponents = [];
    if (this.components != null) {
      for (const component of this.components) {
        if (component != null && component.id != null) {
          if (this.componentsToChecked[component.id]) {
            selectedComponents.push(component.id);
          }
        }
      }
    }
    return selectedComponents;
  }

  clearComponentsToChecked() {
    this.componentsToChecked = {};
    this.isAnyComponentSelected = false;
  }

  /**
   * Get the component numbers and component types that have been selected
   * @return an array of strings
   * example
   * [
   *   "1. OpenResponse",
   *   "3. MultipleChoice"
   * ]
   */
  getSelectedComponentNumbersAndTypes() {
    const selectedComponents = [];
    if (this.components != null) {
      for (let c = 0; c < this.components.length; c++) {
        const component = this.components[c];
        if (component != null && component.id != null) {
          if (this.componentsToChecked[component.id]) {
            const componentNumberAndType = c + 1 + '. ' + component.type;
            selectedComponents.push(componentNumberAndType);
          }
        }
      }
    }
    return selectedComponents;
  }

  importComponent() {
    this.$state.go('root.at.project.node.import-component.choose-step');
  }

  moveButtonClicked() {
    this.showDefaultComponentsView();
    this.turnOnMoveComponentMode();
    this.turnOnInsertComponentMode();
    this.hideComponentAuthoring();
  }

  copyButtonClicked() {
    this.showDefaultComponentsView();
    this.turnOnCopyComponentMode();
    this.turnOnInsertComponentMode();
    this.hideComponentAuthoring();
  }

  deleteButtonClicked() {
    this.scrollToTopOfPage();
    this.hideComponentAuthoring();

    /*
     * Use a timeout to allow the effects of hideComponentAuthoring() to
     * take effect. If we don't use a timeout, the user won't see any change
     * in the UI.
     */
    this.$timeout(() => {
      let confirmMessage = '';
      const selectedComponentNumbersAndTypes = this.getSelectedComponentNumbersAndTypes();
      if (selectedComponentNumbersAndTypes.length == 1) {
        confirmMessage = this.$translate('areYouSureYouWantToDeleteThisComponent');
      } else if (selectedComponentNumbersAndTypes.length > 1) {
        confirmMessage = this.$translate('areYouSureYouWantToDeleteTheseComponents');
      }
      for (let c = 0; c < selectedComponentNumbersAndTypes.length; c++) {
        confirmMessage += '\n' + selectedComponentNumbersAndTypes[c];
      }
      if (confirm(confirmMessage)) {
        const selectedComponents = this.getSelectedComponentIds();
        const data = {
          componentsDeleted: this.getComponentObjectsForEventData(selectedComponents)
        };
        for (const componentId of selectedComponents) {
          this.ProjectService.deleteComponent(this.nodeId, componentId);
        }
        this.saveEvent('componentDeleted', 'Authoring', data);
        this.checkIfNeedToShowNodeSaveOrNodeSubmitButtons();
        this.ProjectService.saveProject();
      }
      this.turnOffInsertComponentMode();
      this.clearComponentsToChecked();
      this.showComponentAuthoring();
    });
  }

  cancelInsertClicked() {
    this.showDefaultComponentsView();
    this.turnOffMoveComponentMode();
    this.turnOffInsertComponentMode();
    this.clearComponentsToChecked();
    this.showComponentAuthoring();
  }

  checkIfNeedToShowNodeSaveOrNodeSubmitButtons() {
    if (!this.ProjectService.doesAnyComponentInNodeShowSubmitButton(this.nodeId)) {
      if (this.ProjectService.doesAnyComponentHaveWork(this.nodeId)) {
        this.nodeJson.showSaveButton = true;
        this.nodeJson.showSubmitButton = false;
        this.hideAllComponentSaveButtons();
      } else {
        this.nodeJson.showSaveButton = false;
        this.nodeJson.showSubmitButton = false;
      }
    }
  }

  insertComponentAsFirst() {
    if (this.moveComponentMode) {
      this.handleMoveComponent();
    } else if (this.copyComponentMode) {
      this.handleCopyComponent();
    }
  }

  insertComponentAfter(componentId: string): void {
    if (this.moveComponentMode) {
      this.handleMoveComponent(componentId);
    } else if (this.copyComponentMode) {
      this.handleCopyComponent(componentId);
    }
  }

  /**
   * Move components in this step.
   * @param componentId (optional) Put the moved components after this component
   * id. If the componentId is not provided, we will put the components at the
   * beginning of the step.
   */
  private handleMoveComponent(componentId = null): void {
    const selectedComponentIds = this.getSelectedComponentIds();
    if (selectedComponentIds.indexOf(componentId) != -1) {
      if (selectedComponentIds.length === 1) {
        alert(this.$translate('youAreNotAllowedToInsertTheSelectedItemAfterItself'));
      } else if (selectedComponentIds.length > 1) {
        alert(this.$translate('youAreNotAllowedToInsertTheSelectedItemsAfterItself'));
      }
    } else {
      const newComponents = this.NodeService.moveComponent(
        this.nodeId,
        selectedComponentIds,
        componentId
      );
      this.ProjectService.saveProject();
      const eventData = {
        componentsMoved: this.getComponentObjectsForEventData(selectedComponentIds)
      };
      this.saveEvent('componentMoved', 'Authoring', eventData);
      this.turnOffMoveComponentMode();
      this.highlightNewComponentsAndThenShowComponentAuthoring(newComponents);
    }
  }

  /**
   * Copy components in this step.
   * @param componentId (optional) Put the copied components after this component id. If the
   * componentId is not provided, put the components at the beginning of the step.
   */
  handleCopyComponent(componentId = null) {
    const selectedComponentIds = this.getSelectedComponentIds();
    const newComponents = this.CopyComponentService.copyComponents(
      this.nodeId,
      selectedComponentIds
    );
    this.InsertComponentService.insertComponents(newComponents, this.nodeId, componentId);
    const componentsCopied = this.getComponentObjectsForEventData(selectedComponentIds);
    for (let c = 0; c < componentsCopied.length; c++) {
      const componentCopied = componentsCopied[c];
      const newComponent = newComponents[c];
      componentCopied.fromComponentId = componentCopied.componentId;
      componentCopied.toComponentId = newComponent.id;
      delete componentCopied.componentId;
    }
    const data = {
      componentsCopied: componentsCopied
    };
    this.saveEvent('componentCopied', 'Authoring', data);
    this.turnOffCopyComponentMode();
    this.ProjectService.saveProject();
    this.highlightNewComponentsAndThenShowComponentAuthoring(newComponents);
  }

  /**
   * Temporarily highlight the new components and then show the component
   * authoring views. Used to bring user's attention to new changes.
   * @param newComponents an array of the new components we have just added
   */
  highlightNewComponentsAndThenShowComponentAuthoring(newComponents) {
    this.showComponentAuthoring();
    this.turnOffInsertComponentMode();
    this.showDefaultComponentsView();
    this.clearComponentsToChecked();

    // wait for the UI to update and then scroll to the first new component
    this.$timeout(() => {
      if (newComponents != null && newComponents.length > 0) {
        const componentElement = $('#' + newComponents[0].id);
        $('#content').scrollTop(componentElement.offset().top - 200);
        for (const newComponent of newComponents) {
          temporarilyHighlightElement(newComponent.id);
        }
      }
    });
  }

  scrollToTopOfPage() {
    this.$anchorScroll('top');
  }

  getComponentTypeLabel(componentType) {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  /**
   * Save an Authoring Tool event
   * @param eventName the name of the event
   * @param category the category of the event
   * example 'Navigation' or 'Authoring'
   * @param data (optional) an object that contains more specific data about the event
   */
  saveEvent(eventName, category, data) {
    const context = 'AuthoringTool';
    const nodeId = this.nodeId;
    const componentId = null;
    const componentType = null;
    if (data == null) {
      data = {};
    }
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      eventName,
      data
    );
  }

  /**
   * Get an array of objects that contain the component id and type
   * @param componentIds an array of component ids
   * @return an array of objects that contain the component id and type
   * TODO refactor too many nesting
   */
  getComponentObjectsForEventData(componentIds) {
    const componentObjects = [];
    for (const componentId of componentIds) {
      const component = this.ProjectService.getComponent(this.nodeId, componentId);
      if (component != null) {
        componentObjects.push({
          componentId: component.id,
          type: component.type
        });
      }
    }
    return componentObjects;
  }

  showComponentAdvancedAuthoring(componentContent: ComponentContent) {
    const component = new Component(componentContent, this.nodeId);
    this.$mdDialog.show({
      templateUrl: 'assets/wise5/authoringTool/components/edit-component-advanced.html',
      controller: [
        '$scope',
        '$mdDialog',
        function ($scope: any, $mdDialog: any) {
          $scope.close = function () {
            $mdDialog.hide();
          };
        }
      ],
      controllerAs: '$ctrl',
      bindToController: true,
      locals: {
        component: component,
        nodeId: this.nodeId
      },
      fullscreen: true,
      clickOutsideToClose: true
    });
  }

  componentCheckboxClicked(): void {
    this.isAnyComponentSelected = Object.values(this.componentsToChecked).some((value) => value);
  }
}

export const NodeAuthoringComponent = {
  templateUrl: `/assets/wise5/authoringTool/node/nodeAuthoring.html`,
  controller: NodeAuthoringController,
  bindings: {
    node: '<',
    projectId: '<'
  }
};
