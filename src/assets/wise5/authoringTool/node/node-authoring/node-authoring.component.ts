import { Component, OnInit } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { NotificationService } from '../../../services/notificationService';
import { NodeService } from '../../../services/nodeService';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { Node } from '../../../common/Node';
import { copy } from '../../../common/object/object';
import { ComponentContent } from '../../../common/ComponentContent';
import { temporarilyHighlightElement } from '../../../common/dom/dom';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../wise5/services/configService';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { Component as WiseComponent } from '../../../common/Component';
import { UpgradeModule } from '@angular/upgrade/static';
import { ChooseNewComponent } from '../../../../../app/authoring-tool/add-component/choose-new-component/choose-new-component.component';

@Component({
  selector: 'node-authoring',
  templateUrl: './node-authoring.component.html',
  styleUrls: ['./node-authoring.component.scss']
})
export class NodeAuthoringComponent implements OnInit {
  components: any = [];
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
    private componentServiceLookupService: ComponentServiceLookupService,
    private componentTypeService: ComponentTypeService,
    private dialog: MatDialog,
    private nodeService: NodeService,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private teacherDataService: TeacherDataService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
    this.nodeId = this.upgrade.$injector.get('$stateParams').nodeId;
    this.node = this.projectService.getNode(this.nodeId);
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
          this.setShowSaveButtonForAllComponents(this.nodeJson, true);
        } else {
          if (this.projectService.doesAnyComponentInNodeShowSubmitButton(this.nodeJson.id)) {
            this.setShowSaveButtonForAllComponents(this.nodeJson, true);
          } else {
            this.nodeJson.showSaveButton = true;
            this.nodeJson.showSubmitButton = false;
            this.setShowSaveButtonForAllComponents(this.nodeJson, false);
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
    if (this.$state.current.name !== 'root.at.project.node') {
      this.teacherDataService.setCurrentNode(null);
    }
    this.subscriptions.unsubscribe();
  }

  protected previewStepInNewWindow(): void {
    this.saveEvent('stepPreviewed', 'Navigation', { constraints: true });
    window.open(`${this.configService.getConfigParam('previewProjectURL')}/${this.nodeId}`);
  }

  protected close(): void {
    this.teacherDataService.setCurrentNode(null);
    this.scrollToTopOfPage();
  }

  protected addComponent(insertAfterComponentId: string): void {
    const dialogRef = this.dialog.open(ChooseNewComponent, {
      data: insertAfterComponentId,
      width: '80%'
    });
    dialogRef
      .afterClosed()
      .pipe(filter((componentType) => componentType != null))
      .subscribe((componentType) => {
        const component = this.projectService.createComponent(
          this.nodeId,
          componentType,
          insertAfterComponentId
        );
        this.projectService.saveProject();
        this.highlightNewComponentsAndThenShowComponentAuthoring([component]);
      });
  }

  protected hideAllComponentSaveButtons(): void {
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
  protected authoringViewNodeChanged(parseProject = false): any {
    this.undoStack.push(this.currentNodeCopy);
    this.currentNodeCopy = copy(this.nodeJson);
    if (parseProject) {
      this.projectService.parseProject();
      this.items = this.projectService.idToOrder;
    }
    return this.projectService.saveProject();
  }

  protected undo(): void {
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

  private hideAllViews(): void {
    this.showStepButtons = false;
    this.showComponents = false;
    this.notificationService.hideJSONValidMessage();
  }

  private showDefaultComponentsView(): void {
    this.hideAllViews();
    this.showStepButtons = true;
    this.showComponents = true;
  }

  protected showAdvancedView(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node.advanced');
  }

  protected setShowComponentAuthoringViews(showComponentAuthoringViews: boolean): void {
    this.showComponentAuthoringViews = showComponentAuthoringViews;
  }

  private setInsertComponentMode(insertComponentMode: boolean): void {
    this.insertComponentMode = insertComponentMode;
  }

  private setMoveComponentMode(moveComponentMode: boolean): void {
    this.moveComponentMode = moveComponentMode;
  }

  private setCopyComponentMode(copyComponentMode: boolean): void {
    this.copyComponentMode = copyComponentMode;
  }

  protected getSelectedComponentIds(): string[] {
    return this.components
      .filter((component: any) => this.componentsToChecked[component.id])
      .map((component: any) => component.id);
  }

  private clearComponentsToChecked(): void {
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
  private getSelectedComponentNumbersAndTypes(): string[] {
    const selectedComponents = [];
    for (let c = 0; c < this.components.length; c++) {
      const component = this.components[c];
      if (this.componentsToChecked[component.id]) {
        const componentNumberAndType = c + 1 + '. ' + component.type;
        selectedComponents.push(componentNumberAndType);
      }
    }
    return selectedComponents;
  }

  protected moveComponents(): void {
    this.showDefaultComponentsView();
    this.setMoveComponentMode(true);
    this.setInsertComponentMode(true);
    this.setShowComponentAuthoringViews(false);
  }

  protected copyComponents(): void {
    this.showDefaultComponentsView();
    this.setCopyComponentMode(true);
    this.setInsertComponentMode(true);
    this.setShowComponentAuthoringViews(false);
  }

  protected copyComponent(event: any, component: ComponentContent): void {
    event.stopPropagation();
    this.handleCopyComponent([component.id], component.id);
  }

  protected deleteComponents(): void {
    this.scrollToTopOfPage();
    this.setShowComponentAuthoringViews(false);
    if (this.confirmDeleteComponent(this.getSelectedComponentNumbersAndTypes())) {
      const componentIdAndTypes = this.getSelectedComponentIds()
        .map((componentId) => this.node.deleteComponent(componentId))
        .map((component) => ({ componentId: component.id, type: component.type }));
      this.afterDeleteComponent(componentIdAndTypes);
    }
    this.setInsertComponentMode(false);
    this.setShowComponentAuthoringViews(true);
  }

  protected deleteComponent(
    event: any,
    componentNumber: number,
    component: ComponentContent
  ): void {
    event.stopPropagation();
    if (this.confirmDeleteComponent([`${componentNumber}. ${component.type}`])) {
      const deletedComponent = this.node.deleteComponent(component.id);
      this.afterDeleteComponent([
        { componentId: deletedComponent.id, type: deletedComponent.type }
      ]);
    }
  }

  private confirmDeleteComponent(componentLabels: string[]): boolean {
    let confirmMessage =
      componentLabels.length === 1
        ? $localize`Are you sure you want to delete this component?\n`
        : $localize`Are you sure you want to delete these components?\n`;
    confirmMessage += `${componentLabels.join('\n')}`;
    return confirm(confirmMessage);
  }

  private afterDeleteComponent(componentIdAndTypes: any[]): void {
    for (const componentIdAndType of componentIdAndTypes) {
      delete this.componentsToChecked[componentIdAndType.componentId];
    }
    this.updateIsAnyComponentSelected();
    this.saveEvent('componentDeleted', 'Authoring', { componentsDeleted: componentIdAndTypes });
    this.checkIfNeedToShowNodeSaveOrNodeSubmitButtons();
    this.projectService.saveProject();
  }

  protected cancelInsertClicked(): void {
    this.showDefaultComponentsView();
    this.setMoveComponentMode(false);
    this.setInsertComponentMode(false);
    this.clearComponentsToChecked();
    this.setShowComponentAuthoringViews(true);
  }

  private checkIfNeedToShowNodeSaveOrNodeSubmitButtons(): void {
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

  protected insertComponentAsFirst(): void {
    if (this.moveComponentMode) {
      this.handleMoveComponent();
    } else if (this.copyComponentMode) {
      this.handleCopyComponent(this.getSelectedComponentIds());
    }
  }

  protected insertComponentAfter(componentId: string): void {
    if (this.moveComponentMode) {
      this.handleMoveComponent(componentId);
    } else if (this.copyComponentMode) {
      this.handleCopyComponent(this.getSelectedComponentIds(), componentId);
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
      this.projectService.getNode(this.nodeId).moveComponents(selectedComponentIds, componentId);
      this.projectService.saveProject();
      const eventData = {
        componentsMoved: this.getComponentObjectsForEventData(selectedComponentIds)
      };
      this.saveEvent('componentMoved', 'Authoring', eventData);
      this.setMoveComponentMode(false);
      this.highlightNewComponentsAndThenShowComponentAuthoring(
        selectedComponentIds.map((componentId) => ({ id: componentId })),
        false
      );
    }
  }

  /**
   * Copy components in this step.
   * @param selectedComponentIds The ids of the components to copy.
   * @param componentId (optional) Put the copied components after this component id. If the
   * componentId is not provided, put the components at the beginning of the step.
   */
  protected handleCopyComponent(selectedComponentIds: string[], componentId: string = null): void {
    const newComponents = this.node.copyComponents(selectedComponentIds);
    this.node.insertComponents(newComponents, componentId);
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
    this.setCopyComponentMode(false);
    this.projectService.saveProject();
    this.highlightNewComponentsAndThenShowComponentAuthoring(newComponents);
  }

  /**
   * Temporarily highlight the new components and then show the component
   * authoring views. Used to bring user's attention to new changes.
   * @param newComponents an array of the new components we have just added
   * @param expandComponents expand component(s)' authoring views after highlighting
   */
  private highlightNewComponentsAndThenShowComponentAuthoring(
    newComponents: any = [],
    expandComponents: boolean = true
  ): void {
    this.setShowComponentAuthoringViews(true);
    this.setInsertComponentMode(false);
    this.showDefaultComponentsView();
    this.clearComponentsToChecked();

    // wait for the UI to update and then scroll to the first new component
    setTimeout(() => {
      if (newComponents.length > 0) {
        const componentElement = $('#' + newComponents[0].id);
        $('#content').scrollTop(componentElement.offset().top - 200);
        for (const newComponent of newComponents) {
          temporarilyHighlightElement(newComponent.id);
          this.componentsToIsExpanded[newComponent.id] = expandComponents;
        }
      }
    });
  }

  private scrollToTopOfPage(): void {
    document.getElementById('top').scrollIntoView();
  }

  protected getComponentTypeLabel(componentType: string): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  /**
   * Save an Authoring Tool event
   * @param eventName the name of the event
   * @param category the category of the event
   * example 'Navigation' or 'Authoring'
   * @param data (optional) an object that contains more specific data about the event
   */
  private saveEvent(eventName: string, category: string, data: any): void {
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
  private getComponentObjectsForEventData(componentIds: string[]): any[] {
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

  protected showComponentAdvancedAuthoring(componentContent: ComponentContent, event: any): void {
    event.stopPropagation();
    this.dialog.open(EditComponentAdvancedComponent, {
      data: new WiseComponent(componentContent, this.nodeId),
      width: '80%'
    });
  }

  protected updateIsAnyComponentSelected(): void {
    this.isAnyComponentSelected = Object.values(this.componentsToChecked).some((value) => value);
  }

  protected componentCheckboxClicked(event: any): void {
    event.stopPropagation();
  }

  protected toggleComponent(componentId: string): void {
    this.componentsToIsExpanded[componentId] = !this.componentsToIsExpanded[componentId];
  }

  protected setAllComponentsIsExpanded(isExpanded: boolean): void {
    this.components.forEach((component) => {
      this.componentsToIsExpanded[component.id] = isExpanded;
    });
  }

  protected getNumberOfComponentsExpanded(): number {
    return Object.values(this.componentsToIsExpanded).filter((value) => value).length;
  }

  private setShowSaveButtonForAllComponents(node: Node, showSaveButton: boolean): void {
    node.components
      .filter((component) =>
        this.componentServiceLookupService.getService(component.type).componentUsesSaveButton()
      )
      .forEach((component) => (component.showSaveButton = showSaveButton));
  }
}
