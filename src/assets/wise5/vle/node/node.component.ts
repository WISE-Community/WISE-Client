import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ComponentState } from '../../../../app/domain/componentState';
import { Node } from '../../common/Node';
import { ComponentService } from '../../components/componentService';
import { ComponentStateWrapper } from '../../components/ComponentStateWrapper';
import { ConfigService } from '../../services/configService';
import { ConstraintService } from '../../services/constraintService';
import { NodeService } from '../../services/nodeService';
import { NodeStatusService } from '../../services/nodeStatusService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../vleProjectService';
import { copy } from '../../common/object/object';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ComponentComponent } from '../../components/component/component.component';
import { MatButtonModule } from '@angular/material/button';
import { ComponentStateInfoComponent } from '../../common/component-state-info/component-state-info.component';
import { HelpIconComponent } from '../../themes/default/themeComponents/helpIcon/help-icon.component';

@Component({
  imports: [
    CommonModule,
    ComponentComponent,
    ComponentStateInfoComponent,
    FlexLayoutModule,
    HelpIconComponent,
    MatButtonModule
  ],
  selector: 'node',
  standalone: true,
  styleUrl: './node.component.scss',
  templateUrl: './node.component.html'
})
export class NodeComponent implements OnInit {
  private autoSaveInterval: number = 60000; // in milliseconds;
  private autoSaveIntervalId: any;
  protected components: any[];
  protected componentToVisible = {};
  protected dirtyComponentIds: any = [];
  protected dirtySubmitComponentIds: any = [];
  protected disabled: boolean;
  protected latestComponentState: ComponentState;
  @Input() node: Node;
  protected nodeStatus: any;
  protected showRubric: boolean;
  private subscriptions: Subscription = new Subscription();
  private workComponents: string[] = [
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
    'PeerChat',
    'Summary',
    'Table'
  ];
  protected workgroupId: number;

  constructor(
    private componentService: ComponentService,
    private configService: ConfigService,
    private constraintService: ConstraintService,
    private nodeService: NodeService,
    private nodeStatusService: NodeStatusService,
    private projectService: VLEProjectService,
    private sessionService: SessionService,
    private studentDataService: StudentDataService
  ) {}

  ngOnChanges(): void {
    // copy is needed to trigger change detection for current node.components array
    this.components = copy(this.getComponents());
  }

  ngOnInit(): void {
    this.workgroupId = this.configService.getWorkgroupId();
    this.disabled = !this.configService.isRunActive();

    this.initializeNode();
    this.startAutoSaveInterval();
    this.registerExitListener();

    this.subscriptions.add(
      this.studentDataService.componentSaveTriggered$.subscribe(({ nodeId, componentId }) => {
        if (nodeId == this.node.id && this.node.hasComponent(componentId)) {
          this.createAndSaveComponentData(false, componentId);
        }
      })
    );

    this.subscriptions.add(
      this.studentDataService.componentSubmitTriggered$.subscribe(({ nodeId, componentId }) => {
        if (nodeId == this.node.id && this.node.hasComponent(componentId)) {
          this.createAndSaveComponentData(false, componentId, true);
        }
      })
    );

    this.subscriptions.add(
      this.studentDataService.componentStudentData$.subscribe((componentStudentData: any) => {
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
      this.studentDataService.componentDirty$.subscribe(({ componentId, isDirty }) => {
        const index = this.dirtyComponentIds.indexOf(componentId);
        if (isDirty && index === -1) {
          this.dirtyComponentIds.push(componentId);
        } else if (!isDirty && index > -1) {
          this.dirtyComponentIds.splice(index, 1);
        }
      })
    );

    this.subscriptions.add(
      this.studentDataService.componentSubmitDirty$.subscribe(({ componentId, isDirty }) => {
        const index = this.dirtySubmitComponentIds.indexOf(componentId);
        if (isDirty && index === -1) {
          this.dirtySubmitComponentIds.push(componentId);
        } else if (!isDirty && index > -1) {
          this.dirtySubmitComponentIds.splice(index, 1);
        }
      })
    );

    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(({ currentNode }) => {
        this.node = this.projectService.getNode(currentNode.id);
        if (this.node.isEvaluateTransitionLogicOn('exitNode')) {
          this.nodeService.evaluateTransitionLogic();
        }
        this.initializeNode();
      })
    );

    this.subscriptions.add(
      this.studentDataService.nodeStatusesChanged$.subscribe(() => {
        this.updateComponentVisibility();
      })
    );
  }

  private initializeNode(): void {
    this.clearLatestComponentState();
    this.components = this.getComponents();
    this.nodeStatus = this.nodeStatusService.getNodeStatusByNodeId(this.node.id);
    this.dirtyComponentIds = [];
    this.dirtySubmitComponentIds = [];
    this.updateComponentVisibility();

    if (this.node.isEvaluateTransitionLogicOn('enterNode')) {
      this.nodeService.evaluateTransitionLogic();
    }

    const latestComponentState =
      this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(this.node.id);
    if (latestComponentState) {
      this.latestComponentState = latestComponentState;
    }

    if (this.configService.isPreview()) {
      this.showRubric = this.node.rubric != null && this.node.rubric != '';
    }

    const nodeContent = this.projectService.getNodeById(this.node.id);
    const script = nodeContent.script;
    if (script != null) {
      this.projectService.retrieveScript(script).then((script: string) => {
        new Function(script).call(this);
      });
    }
  }

  private updateComponentVisibility(): void {
    this.components.forEach((component) => {
      const constraintResult = this.constraintService.evaluate(component.constraints);
      this.componentToVisible[component.id] = constraintResult.isVisible;
    });
  }

  ngOnDestroy() {
    this.stopAutoSaveInterval();
    this.subscriptions.unsubscribe();
  }

  protected save(): void {
    this.createAndSaveComponentData(false);
  }

  protected submit(): void {
    this.nodeService.broadcastNodeSubmitClicked({ nodeId: this.node.id });
    this.createAndSaveComponentData(false, null, true);
  }

  private getComponents(): any[] {
    return this.node.components.map((component) => {
      if (this.disabled) {
        component.isDisabled = true;
      }
      return component;
    });
  }

  private clearLatestComponentState(): void {
    this.latestComponentState = null;
  }

  private startAutoSaveInterval(): void {
    this.autoSaveIntervalId = setInterval(() => {
      if (this.dirtyComponentIds.length) {
        this.createAndSaveComponentData(true);
      }
    }, this.autoSaveInterval);
  }

  private stopAutoSaveInterval(): void {
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
  private createAndSaveComponentData(
    isAutoSave: boolean,
    componentId = null,
    isSubmit = null
  ): Promise<any> {
    return this.createComponentStates(isAutoSave, componentId, isSubmit).then(
      this.createComponentStatesResponseHandler(isAutoSave, componentId, isSubmit)
    );
  }

  private createComponentStatesResponseHandler(
    isAutoSave: boolean,
    componentId: string = null,
    isSubmit: boolean = null
  ) {
    return (componentStates) => {
      const componentAnnotations = this.getAnnotationsFromComponentStates(componentStates);
      componentStates.forEach((componentState: any) => {
        this.injectAdditionalComponentStateFields(componentState, isAutoSave, isSubmit);
        this.notifyConnectedParts(componentId, componentState);
      });
      return this.studentDataService
        .saveToServer(componentStates, [], componentAnnotations)
        .then((savedStudentDataResponse) => {
          if (savedStudentDataResponse) {
            if (this.node.isEvaluateTransitionLogicOn('studentDataChanged')) {
              this.nodeService.evaluateTransitionLogic();
            }
            if (
              this.node.isEvaluateTransitionLogicOn('scoreChanged') &&
              componentAnnotations.some((annotation) => annotation.type === 'autoScore')
            ) {
              this.nodeService.evaluateTransitionLogic();
            }
            const studentWorkList = savedStudentDataResponse.studentWorkList;
            if (!componentId && studentWorkList && studentWorkList.length) {
              const latestComponentState = studentWorkList[studentWorkList.length - 1];
              if (latestComponentState.nodeId === this.node.id) {
                this.latestComponentState = latestComponentState;
              }
            } else {
              this.clearLatestComponentState();
            }
          }
          return savedStudentDataResponse;
        });
    };
  }

  private getAnnotationsFromComponentStates(componentStates: any[]): any[] {
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
  private createComponentStates(
    isAutoSave: boolean = false,
    componentId: string,
    isSubmit: boolean = false
  ): any {
    const components = this.getComponentsToSave(componentId);
    const componentStatePromises = this.getComponentStatePromises(components, isAutoSave, isSubmit);
    return Promise.all(componentStatePromises).then((componentStatesFromComponents: any[]) => {
      return componentStatesFromComponents.filter((componentState: any) => componentState != null);
    });
  }

  private getComponentsToSave(componentId: string): any[] {
    if (componentId) {
      return [this.node.getComponent(componentId)];
    } else {
      const nodeStatus = this.studentDataService.getNodeStatusByNodeId(this.node.id);
      return this.getComponents().filter(
        (component) =>
          this.workComponents.includes(component.type) &&
          nodeStatus.componentStatuses[component.id].isVisible
      );
    }
  }

  private getComponentStatePromises(
    components: any[],
    isAutoSave: boolean = false,
    isSubmit: boolean = false
  ): any[] {
    const componentStatePromises = [];
    for (const component of components) {
      componentStatePromises.push(
        this.getComponentStatePromise(this.node.id, component.id, isAutoSave, isSubmit)
      );
      this.componentService.requestComponentState(this.node.id, component.id, isSubmit);
    }
    return componentStatePromises;
  }

  private getComponentStatePromise(
    nodeId: string,
    componentId: string,
    isAutoSave: boolean = false,
    isSubmit: boolean = false
  ): Promise<any> {
    return new Promise((resolve) => {
      this.componentService.sendComponentStateSource$
        .pipe(
          filter(
            (data: ComponentStateWrapper) =>
              data.nodeId === nodeId && data.componentId === componentId
          ),
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

  private resolveComponentStatePromise(
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

  private injectAdditionalComponentStateFields(
    componentState: any,
    isAutoSave: boolean = false,
    isSubmit: boolean = false
  ): any {
    componentState.runId = this.configService.getRunId();
    componentState.periodId = this.configService.getPeriodId();
    componentState.workgroupId = this.workgroupId;
    componentState.isAutoSave = isAutoSave === true;
    componentState.isSubmit ??= isSubmit;
  }

  /**
   * Notify any connected components that the student data has changed
   * @param componentId the component id that has changed
   * @param componentState the new component state
   */
  private notifyConnectedParts(changedComponentId: string, componentState: any): void {
    for (const component of this.getComponents()) {
      if (component.connectedComponents != null) {
        for (const connectedComponent of component.connectedComponents) {
          if (
            connectedComponent.nodeId === componentState.nodeId &&
            connectedComponent.componentId === componentState.componentId
          ) {
            this.componentService.notifyConnectedComponentSubscribers(
              this.node.id,
              component.id,
              componentState
            );
          }
        }
      }
    }
  }

  protected getComponentStateByComponentId(componentId: string): any {
    return this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.node.id,
      componentId
    );
  }

  private registerExitListener(): void {
    this.subscriptions.add(
      this.sessionService.exit$.subscribe(() => {
        this.stopAutoSaveInterval();
      })
    );
  }

  protected saveComponentState($event: any): Promise<any> {
    return Promise.all([$event.componentStatePromise]).then(
      this.createComponentStatesResponseHandler(true)
    );
  }
}
