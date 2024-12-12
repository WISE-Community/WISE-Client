import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { Node } from '../../../common/Node';
import { ComponentContent } from '../../../common/ComponentContent';
import { scrollToTopOfPage, temporarilyHighlightElement } from '../../../common/dom/dom';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { DeleteTranslationsService } from '../../../services/deleteTranslationsService';

@Component({
  selector: 'node-authoring',
  templateUrl: './node-authoring.component.html',
  styleUrls: ['./node-authoring.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NodeAuthoringComponent implements OnInit {
  components: ComponentContent[] = [];
  protected editingComponentId: string;
  isGroupNode: boolean;
  node: Node;
  nodeJson: any;
  @Input() nodeId?: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private componentServiceLookupService: ComponentServiceLookupService,
    private componentTypeService: ComponentTypeService,
    private nodeService: TeacherNodeService,
    private projectService: TeacherProjectService,
    private dataService: TeacherDataService,
    private deleteTranslationsService: DeleteTranslationsService
  ) {}

  ngOnInit(): void {
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
    this.components = this.projectService.getComponents(this.nodeId);

    if (history.state.newComponents && history.state.newComponents.length > 0) {
      this.highlightComponents(history.state.newComponents);
    } else {
      scrollToTopOfPage();
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
          // this.setAllComponentsIsExpanded(true);
        }
      })
    );
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

  protected deleteComponent(
    event: any,
    componentNumber: number,
    component: ComponentContent
  ): void {
    event.stopPropagation();
    if (this.confirmDeleteComponent([`${componentNumber}. ${component.type}`])) {
      this.deleteComponentsOnServer([this.node.deleteComponent(component.id)]);
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

  private deleteComponentsOnServer(components: ComponentContent[]): void {
    this.checkIfNeedToShowNodeSaveOrNodeSubmitButtons();
    this.projectService.saveProject().then(() => {
      this.deleteTranslationsService.tryDeleteComponents(components);
    });
  }

  private checkIfNeedToShowNodeSaveOrNodeSubmitButtons(): void {
    if (!this.projectService.doesAnyComponentInNodeShowSubmitButton(this.nodeId)) {
      if (this.hasComponentsWithWork()) {
        this.nodeJson.showSaveButton = true;
        this.nodeJson.showSubmitButton = false;
        this.hideAllComponentSaveButtons();
      } else {
        this.nodeJson.showSaveButton = false;
        this.nodeJson.showSubmitButton = false;
      }
    }
  }

  private hasComponentsWithWork(): boolean {
    return this.node.components.some((component) =>
      this.componentServiceLookupService.getService(component.type).componentHasWork(component)
    );
  }

  /**
   * Temporarily highlight the specified components
   * @param components an array of components to highlight
   */
  protected highlightComponents(components: any = []): void {
    // wait for the UI to update and then highlight the first component
    setTimeout(() => {
      if (components.length > 0) {
        document.getElementById(components[0].id).scrollIntoView();
        for (const component of components) {
          temporarilyHighlightElement(component.id);
        }
      }
    }, 100);
  }

  protected getComponentTypeLabel(componentType: string): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  private setShowSaveButtonForAllComponents(node: Node, showSaveButton: boolean): void {
    node.components
      .filter((component) =>
        this.componentServiceLookupService.getService(component.type).componentUsesSaveButton()
      )
      .forEach((component) => (component.showSaveButton = showSaveButton));
  }

  protected dropComponent(event: CdkDragDrop<ComponentContent[]>): void {
    this.moveComponent(event.previousIndex, event.currentIndex);
  }

  protected moveComponent(
    previousIndex: number,
    currentIndex: number,
    scroll: boolean = false
  ): void {
    moveItemInArray(this.components, previousIndex, currentIndex);
    if (scroll) {
      this.highlightComponents([this.components[currentIndex]]);
    }
    this.projectService.saveProject();
  }

  protected editComponent(componentId: string): void {
    this.editingComponentId = componentId;
  }
}
