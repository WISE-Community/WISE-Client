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
  currentNodeCopy: any;
  isAnyComponentSelected: boolean = false;
  isGroupNode: boolean;
  node: Node;
  nodeJson: any;
  nodeCopy: any = null;
  nodeId: string;
  nodePosition: any;
  originalNodeCopy: any;
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

  private showDefaultComponentsView(): void {
    this.notificationService.hideJSONValidMessage();
  }

  protected showAdvancedView(): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node.advanced');
  }

  protected getSelectedComponents(): string[] {
    return this.components.filter((component: any) => this.componentsToChecked[component.id]);
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

  protected chooseComponentLocation(action: string): void {
    this.upgrade.$injector.get('$state').go('root.at.project.node.choose-component-location', {
      action: action,
      selectedComponents: this.getSelectedComponents()
    });
  }

  protected copyComponent(event: any, component: ComponentContent): void {
    event.stopPropagation();
    const newComponents = this.node.copyComponents([component.id]);
    this.node.insertComponents(newComponents, component.id);
    this.projectService.saveProject();
    this.highlightNewComponentsAndThenShowComponentAuthoring(newComponents);
  }

  protected deleteComponents(): void {
    this.scrollToTopOfPage();
    if (this.confirmDeleteComponent(this.getSelectedComponentNumbersAndTypes())) {
      const componentIdAndTypes = this.getSelectedComponentIds()
        .map((componentId) => this.node.deleteComponent(componentId))
        .map((component) => ({ componentId: component.id, type: component.type }));
      this.afterDeleteComponent(componentIdAndTypes);
    }
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
    this.checkIfNeedToShowNodeSaveOrNodeSubmitButtons();
    this.projectService.saveProject();
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
