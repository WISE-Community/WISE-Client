import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { NotificationService } from '../../../services/notificationService';
import { NodeService } from '../../../services/nodeService';
import { InsertComponentService } from '../../../services/insertComponentService';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { CopyComponentService } from '../../../services/copyComponentService';
import { Node } from '../../../common/Node';
import { copy } from '../../../common/object/object';
import { ComponentContent } from '../../../common/ComponentContent';
import { temporarilyHighlightElement } from '../../../common/dom/dom';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../wise5/services/configService';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { Component as WiseComponent } from '../../../common/Component';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'node-authoring',
  templateUrl: './node-authoring.component.html',
  styleUrls: ['./node-authoring.component.scss']
})
export class NodeAuthoringComponent implements OnInit {
  components: any;
  componentsToChecked = {};
  componentsToIsExpanded = {};
  copyComponentMode: boolean = false;
  currentNodeCopy: any;
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
  $state: any;

  constructor(
    private configService: ConfigService,
    private copyComponentService: CopyComponentService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private componentTypeService: ComponentTypeService,
    private dialog: MatDialog,
    private insertComponentService: InsertComponentService,
    private nodeService: NodeService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private teacherDataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
    this.nodeId = this.upgrade.$injector.get('$stateParams').nodeId;
    this.isGroupNode = this.projectService.isGroupNode(this.nodeId);
    this.teacherDataService.setCurrentNodeByNodeId(this.nodeId);
    this.nodeJson = this.projectService.getNodeById(this.nodeId);
    this.nodePosition = this.projectService.getNodePositionById(this.nodeId);
    this.components = this.projectService.getComponents(this.nodeId);

    /*
     * remember a copy of the node at the beginning of this node authoring
     * session in case we need to roll back if the user decides to
     * cancel/revert all the changes.
     */
    this.originalNodeCopy = copy(this.nodeJson);
    this.currentNodeCopy = copy(this.nodeJson);

    this.subscriptions.add(
      this.nodeService.componentShowSubmitButtonValueChanged$.subscribe(({ showSubmitButton }) => {
        if (showSubmitButton) {
          this.nodeJson.showSaveButton = false;
          this.nodeJson.showSubmitButton = false;
          this.projectService.turnOnSaveButtonForAllComponents(this.nodeJson);
        } else {
          if (this.projectService.doesAnyComponentInNodeShowSubmitButton(this.nodeJson.id)) {
            this.projectService.turnOnSaveButtonForAllComponents(this.nodeJson);
          } else {
            this.nodeJson.showSaveButton = true;
            this.nodeJson.showSubmitButton = false;
            this.projectService.turnOffSaveButtonForAllComponents(this.nodeJson);
          }
        }
        this.authoringViewNodeChanged();
      })
    );

    const data = {
      title: this.projectService.getNodePositionAndTitle(this.nodeId)
    };
    if (this.isGroupNode) {
      this.saveEvent('activityViewOpened', 'Navigation', data);
    } else {
      this.saveEvent('stepViewOpened', 'Navigation', data);
    }
    if (this.upgrade.$injector.get('$stateParams').newComponents.length > 0) {
      this.highlightNewComponentsAndThenShowComponentAuthoring(
        this.upgrade.$injector.get('$stateParams').newComponents
      );
    } else {
      this.scrollToTopOfPage();
    }
    this.subscriptions.add(
      this.projectService.nodeChanged$.subscribe((doParseProject) => {
        this.authoringViewNodeChanged(doParseProject);
      })
    );
  }

  ngOnDestroy(): void {
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
    let previewURL = `${this.configService.getConfigParam('previewProjectURL')}/${nodeId}`;
    if (!constraints) {
      previewURL += '?constraints=false';
    }
    return previewURL;
  }

  close(): void {
    this.teacherDataService.setCurrentNode(null);
    this.scrollToTopOfPage();
  }

  showSaveErrorAdvancedAuthoring(): void {
    alert(
      $localize`Error saving advanced authoring, possibly due to malformed JSON content. Check that your JSON is valid. Your changes have not been saved.`
    );
  }

  addComponent(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node.add-component.choose-component');
  }

  deleteComponent(componentId: string): void {
    if (confirm($localize`Are you sure you want to delete this component?`)) {
      this.projectService.deleteComponent(this.nodeId, componentId);
      this.checkIfNeedToShowNodeSaveOrNodeSubmitButtons();
      this.projectService.saveProject();
    }
  }

  hideAllComponentSaveButtons(): void {
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
  authoringViewNodeChanged(parseProject = false): any {
    this.undoStack.push(this.currentNodeCopy);
    this.currentNodeCopy = copy(this.nodeJson);
    if (parseProject) {
      this.projectService.parseProject();
      this.items = this.projectService.idToOrder;
    }
    return this.projectService.saveProject();
  }

  undo(): void {
    if (this.undoStack.length === 0) {
      alert($localize`There are no changes to undo`);
    } else if (this.undoStack.length > 0) {
      if (confirm($localize`Are you sure you want to undo the last change?`)) {
        const nodePreviousVersion = this.undoStack.pop();
        this.projectService.replaceNode(this.nodeId, nodePreviousVersion);
        this.nodeJson = this.projectService.getNodeById(this.nodeId);
        this.components = this.projectService.getComponents(this.nodeId);
        this.projectService.saveProject();
      }
    }
  }

  hideAllViews(): void {
    this.showStepButtons = false;
    this.showComponents = false;
    this.notificationService.hideJSONValidMessage();
  }

  showDefaultComponentsView(): void {
    this.hideAllViews();
    this.showStepButtons = true;
    this.showComponents = true;
  }

  showAdvancedView(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node.advanced');
  }

  editRubric(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node.edit-rubric');
  }

  showComponentAuthoring(): void {
    this.showComponentAuthoringViews = true;
  }

  hideComponentAuthoring(): void {
    this.showComponentAuthoringViews = false;
  }

  turnOnInsertComponentMode(): void {
    this.insertComponentMode = true;
  }

  turnOffInsertComponentMode(): void {
    this.insertComponentMode = false;
  }

  turnOnMoveComponentMode(): void {
    this.moveComponentMode = true;
  }

  turnOffMoveComponentMode(): void {
    this.moveComponentMode = false;
  }

  turnOnCopyComponentMode(): void {
    this.copyComponentMode = true;
  }

  turnOffCopyComponentMode(): void {
    this.copyComponentMode = false;
  }

  getSelectedComponentIds(): string[] {
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

  clearComponentsToChecked(): void {
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
  getSelectedComponentNumbersAndTypes(): string[] {
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
    this.upgrade.$injector.get('$state').go('root.at.project.node.import-component.choose-step');
  }

  moveButtonClicked(): void {
    this.showDefaultComponentsView();
    this.turnOnMoveComponentMode();
    this.turnOnInsertComponentMode();
    this.hideComponentAuthoring();
  }

  copyButtonClicked(): void {
    this.showDefaultComponentsView();
    this.turnOnCopyComponentMode();
    this.turnOnInsertComponentMode();
    this.hideComponentAuthoring();
  }

  deleteButtonClicked(): void {
    this.scrollToTopOfPage();
    this.hideComponentAuthoring();

    /*
     * Use a timeout to allow the effects of hideComponentAuthoring() to
     * take effect. If we don't use a timeout, the user won't see any change
     * in the UI.
     */
    setTimeout(() => {
      let confirmMessage = '';
      const selectedComponentNumbersAndTypes = this.getSelectedComponentNumbersAndTypes();
      if (selectedComponentNumbersAndTypes.length == 1) {
        confirmMessage = $localize`Are you sure you want to delete this component?\n`;
      } else if (selectedComponentNumbersAndTypes.length > 1) {
        confirmMessage = $localize`Are you sure you want to delete these components?\n`;
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
          this.projectService.deleteComponent(this.nodeId, componentId);
        }
        this.saveEvent('componentDeleted', 'Authoring', data);
        this.checkIfNeedToShowNodeSaveOrNodeSubmitButtons();
        this.projectService.saveProject();
      }
      this.turnOffInsertComponentMode();
      this.clearComponentsToChecked();
      this.showComponentAuthoring();
    });
  }

  cancelInsertClicked(): void {
    this.showDefaultComponentsView();
    this.turnOffMoveComponentMode();
    this.turnOffInsertComponentMode();
    this.clearComponentsToChecked();
    this.showComponentAuthoring();
  }

  checkIfNeedToShowNodeSaveOrNodeSubmitButtons(): void {
    if (!this.projectService.doesAnyComponentInNodeShowSubmitButton(this.nodeId)) {
      if (this.projectService.doesAnyComponentHaveWork(this.nodeId)) {
        this.nodeJson.showSaveButton = true;
        this.nodeJson.showSubmitButton = false;
        this.hideAllComponentSaveButtons();
      } else {
        this.nodeJson.showSaveButton = false;
        this.nodeJson.showSubmitButton = false;
      }
    }
  }

  insertComponentAsFirst(): void {
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
        alert($localize`You are not allowed to insert the selected item after itself.`);
      } else if (selectedComponentIds.length > 1) {
        alert($localize`You are not allowed to insert the selected items after itself.`);
      }
    } else {
      const newComponents = this.nodeService.moveComponent(
        this.nodeId,
        selectedComponentIds,
        componentId
      );
      this.projectService.saveProject();
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
  handleCopyComponent(componentId: string = null): void {
    const selectedComponentIds = this.getSelectedComponentIds();
    const newComponents = this.copyComponentService.copyComponents(
      this.nodeId,
      selectedComponentIds
    );
    this.insertComponentService.insertComponents(newComponents, this.nodeId, componentId);
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
    this.projectService.saveProject();
    this.highlightNewComponentsAndThenShowComponentAuthoring(newComponents);
  }

  /**
   * Temporarily highlight the new components and then show the component
   * authoring views. Used to bring user's attention to new changes.
   * @param newComponents an array of the new components we have just added
   */
  highlightNewComponentsAndThenShowComponentAuthoring(newComponents: any = []): void {
    this.showComponentAuthoring();
    this.turnOffInsertComponentMode();
    this.showDefaultComponentsView();
    this.clearComponentsToChecked();

    // wait for the UI to update and then scroll to the first new component
    setTimeout(() => {
      if (newComponents.length > 0) {
        const componentElement = $('#' + newComponents[0].id);
        $('#content').scrollTop(componentElement.offset().top - 200);
        for (const newComponent of newComponents) {
          temporarilyHighlightElement(newComponent.id);
          this.componentsToIsExpanded[newComponent.id] = true;
        }
      }
    });
  }

  scrollToTopOfPage(): void {
    document.getElementById('top').scrollIntoView();
  }

  getComponentTypeLabel(componentType: string): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  /**
   * Save an Authoring Tool event
   * @param eventName the name of the event
   * @param category the category of the event
   * example 'Navigation' or 'Authoring'
   * @param data (optional) an object that contains more specific data about the event
   */
  saveEvent(eventName: string, category: string, data: any): void {
    const context = 'AuthoringTool';
    const nodeId = this.nodeId;
    const componentId = null;
    const componentType = null;
    if (data == null) {
      data = {};
    }
    this.teacherDataService.saveEvent(
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
  getComponentObjectsForEventData(componentIds: string[]): any[] {
    const componentObjects = [];
    for (const componentId of componentIds) {
      const component = this.projectService.getComponent(this.nodeId, componentId);
      if (component != null) {
        componentObjects.push({
          componentId: component.id,
          type: component.type
        });
      }
    }
    return componentObjects;
  }

  showComponentAdvancedAuthoring(componentContent: ComponentContent, event: any): void {
    event.stopPropagation();
    this.dialog.open(EditComponentAdvancedComponent, {
      data: {
        component: new WiseComponent(componentContent, this.nodeId),
        nodeId: this.nodeId
      },
      width: '80%'
    });
  }

  componentCheckboxChanged(): void {
    this.isAnyComponentSelected = Object.values(this.componentsToChecked).some((value) => value);
  }

  componentCheckboxClicked(event: any): void {
    event.stopPropagation();
  }

  toggleComponent(componentId: string): void {
    this.componentsToIsExpanded[componentId] = !this.componentsToIsExpanded[componentId];
  }

  expandAllComponents(): void {
    for (const component of this.components) {
      this.componentsToIsExpanded[component.id] = true;
    }
  }

  collapseAllComponents(): void {
    for (const component of this.components) {
      this.componentsToIsExpanded[component.id] = false;
    }
  }

  getNumberOfComponentsExpanded(): number {
    return Object.values(this.componentsToIsExpanded).filter((value) => value).length;
  }
}
