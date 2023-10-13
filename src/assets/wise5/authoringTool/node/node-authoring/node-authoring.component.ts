import { Component, OnInit } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { Node } from '../../../common/Node';
import { ComponentContent } from '../../../common/ComponentContent';
import { temporarilyHighlightElement } from '../../../common/dom/dom';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../wise5/services/configService';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { Component as WiseComponent } from '../../../common/Component';
import { ChooseNewComponent } from '../../../../../app/authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherNodeService } from '../../../services/teacherNodeService';

@Component({
  selector: 'node-authoring',
  templateUrl: './node-authoring.component.html',
  styleUrls: ['./node-authoring.component.scss']
})
export class NodeAuthoringComponent implements OnInit {
  components: ComponentContent[] = [];
  componentsToChecked = {};
  componentsToExpanded = {};
  isAnyComponentSelected: boolean = false;
  isGroupNode: boolean;
  node: Node;
  nodeJson: any;
  nodeId: string;
  nodePosition: any;
  projectId: number;
  subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private componentTypeService: ComponentTypeService,
    private dialog: MatDialog,
    private nodeService: TeacherNodeService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nodeId = this.route.snapshot.paramMap.get('nodeId');
    this.route.parent.params.subscribe((params) => {
      this.projectId = Number(params.unitId);
    });
    this.setup(this.nodeId);
    this.dataService.setCurrentNodeByNodeId(this.nodeId);
    this.subscribeToShowSubmitButtonValueChanges();
    this.subscribeToNodeChanges();
    this.subscribeToCurrentNodeChanged();
  }

  private setup(nodeId: string): void {
    this.nodeId = nodeId;
    this.node = this.projectService.getNode(this.nodeId);
    this.isGroupNode = this.projectService.isGroupNode(this.nodeId);
    this.nodeJson = this.projectService.getNodeById(this.nodeId);
    this.nodePosition = this.projectService.getNodePositionById(this.nodeId);
    this.components = this.projectService.getComponents(this.nodeId);
    this.componentsToChecked = {};
    this.componentsToExpanded = {};
    this.isAnyComponentSelected = false;

    if (history.state.newComponents && history.state.newComponents.length > 0) {
      this.highlightNewComponentsAndThenShowComponentAuthoring(history.state.newComponents);
    } else {
      this.scrollToTopOfPage();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToShowSubmitButtonValueChanges(): void {
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
  }

  private subscribeToNodeChanges(): void {
    this.subscriptions.add(
      this.projectService.nodeChanged$.subscribe((doParseProject) => {
        this.authoringViewNodeChanged(doParseProject);
      })
    );
  }

  private subscribeToCurrentNodeChanged(): void {
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(({ currentNode }) => {
        if (currentNode != null) {
          this.setup(currentNode.id);
        }
      })
    );
  }

  protected previewStepInNewWindow(): void {
    window.open(`${this.configService.getConfigParam('previewProjectURL')}/${this.nodeId}`);
  }

  protected close(): void {
    this.dataService.setCurrentNode(null);
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
      .subscribe(({ action, componentType }) => {
        if (action === 'import') {
          this.router.navigate(['import-component/choose-component'], {
            relativeTo: this.route,
            state: {
              insertAfterComponentId: insertAfterComponentId
            }
          });
        } else {
          const component = this.projectService.createComponent(
            this.nodeId,
            componentType,
            insertAfterComponentId
          );
          this.projectService.saveProject();
          this.highlightNewComponentsAndThenShowComponentAuthoring([component]);
        }
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
    if (parseProject) {
      this.projectService.parseProject();
    }
    return this.projectService.saveProject();
  }

  protected getSelectedComponents(): ComponentContent[] {
    return this.components.filter(
      (component: ComponentContent) => this.componentsToChecked[component.id]
    );
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
    this.router.navigate(
      ['/teacher/edit/unit', this.projectId, 'node', this.nodeId, 'choose-component-location'],
      {
        state: {
          action: action,
          selectedComponents: this.getSelectedComponents()
        }
      }
    );
  }

  protected copyComponent(event: any, component: ComponentContent): void {
    event.stopPropagation();
    const newComponents = this.node.copyComponents([component.id], component.id);
    this.projectService.saveProject();
    this.highlightNewComponentsAndThenShowComponentAuthoring(newComponents);
  }

  protected deleteComponents(): void {
    this.scrollToTopOfPage();
    if (this.confirmDeleteComponent(this.getSelectedComponentNumbersAndTypes())) {
      const componentIdAndTypes = this.getSelectedComponents()
        .map((component) => this.node.deleteComponent(component.id))
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
      delete this.componentsToExpanded[componentIdAndType.componentId];
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
    this.clearComponentsToChecked();

    // wait for the UI to update and then scroll to the first new component
    setTimeout(() => {
      if (newComponents.length > 0) {
        const componentElement = $('#' + newComponents[0].id);
        $('#content').scrollTop(componentElement.offset().top - 200);
        for (const newComponent of newComponents) {
          temporarilyHighlightElement(newComponent.id);
          this.componentsToExpanded[newComponent.id] = expandComponents;
        }
      }
    }, 100);
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
    this.componentsToExpanded[componentId] = !this.componentsToExpanded[componentId];
  }

  protected setAllComponentsIsExpanded(isExpanded: boolean): void {
    this.components.forEach((component) => {
      this.componentsToExpanded[component.id] = isExpanded;
    });
  }

  protected getNumberOfComponentsExpanded(): number {
    return Object.values(this.componentsToExpanded).filter((value) => value).length;
  }

  private setShowSaveButtonForAllComponents(node: Node, showSaveButton: boolean): void {
    node.components
      .filter((component) =>
        this.componentServiceLookupService.getService(component.type).componentUsesSaveButton()
      )
      .forEach((component) => (component.showSaveButton = showSaveButton));
  }

  protected dropComponent(event: CdkDragDrop<ComponentContent[]>): void {
    moveItemInArray(this.components, event.previousIndex, event.currentIndex);
    this.projectService.saveProject();
  }
}
