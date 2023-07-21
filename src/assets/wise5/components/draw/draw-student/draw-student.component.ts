import { fabric } from 'fabric';
import { Component, ViewEncapsulation } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { DrawService } from '../drawService';
import { MatDialog } from '@angular/material/dialog';
import { copy } from '../../../common/object/object';
import { convertToPNGFile } from '../../../common/canvas/canvas';
import { hasConnectedComponent } from '../../../common/ComponentContent';

@Component({
  selector: 'draw-student',
  templateUrl: 'draw-student.component.html',
  styleUrls: ['draw-student.component.scss', '../drawing-tool.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DrawStudent extends ComponentStudent {
  drawingTool: any;
  drawingToolId: string;
  height: number = 600;
  latestConnectedComponentState: any;
  parentStudentWorkIds: number[] = null;
  isResetButtonVisible: boolean = true;
  showCopyPublicNotebookItemButton: boolean = false;
  width: number = 800;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    private DrawService: DrawService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    const domIdEnding = this.DrawService.getDomIdEnding(
      this.nodeId,
      this.componentId,
      this.componentState
    );
    this.drawingToolId = this.DrawService.getDrawingToolId(domIdEnding);
    this.showCopyPublicNotebookItemButton = this.ProjectService.isSpaceExists('public');
    if (this.isDisabled) {
      this.isResetButtonVisible = false;
    }
    this.subscribeToNotebookItemChosen();
  }

  ngAfterViewInit(): void {
    // When a draw is imported into another component as a background, it is rendered in a popup
    // but sometimes the drawing tool in the popup is not rendered. Using a setTimeout allows the
    // drawing tool to render in the popup consistently.
    setTimeout(() => {
      this.initializeDrawingTool();
    });
  }

  initializeDrawingTool(): void {
    this.setWidthAndHeight();
    this.drawingTool = this.DrawService.initializeDrawingTool(
      this.drawingToolId,
      this.componentContent.stamps,
      this.width,
      this.height
    );
    this.initializeStudentData();
    this.disableComponentIfNecessary();
    this.setDrawingChangedListener();
    this.DrawService.setUpTools(this.drawingToolId, this.componentContent.tools, this.isDisabled);

    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableSubmitButton();
    }
    if (this.isDisabled) {
      this.drawingTool.canvas.removeListeners();
    }

    this.broadcastDoneRenderingComponent();
  }

  setWidthAndHeight(): void {
    if (this.componentContent.width != null) {
      this.width = this.componentContent.width;
    }
    if (this.componentContent.height != null) {
      this.height = this.componentContent.height;
    }
  }

  initializeStudentData(): void {
    if (hasConnectedComponent(this.componentContent, 'showWork')) {
      this.handleConnectedComponents();
    } else if (
      this.DrawService.componentStateHasStudentWork(this.componentState, this.componentContent)
    ) {
      this.setStudentWork(this.componentState);
    } else {
      this.loadConnectedComponentOrStarterDrawDataIfAvailable();
    }
    if (
      !this.DrawService.componentStateHasStudentWork(this.componentState, this.componentContent)
    ) {
      this.setAuthoredBackgroundIfAvailable(true);
    }
  }

  loadConnectedComponentOrStarterDrawDataIfAvailable(): void {
    if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
    } else if (this.isStarterDrawDataAvailable()) {
      this.drawingTool.load(this.componentContent.starterDrawData);
    }
  }

  isStarterDrawDataAvailable(): boolean {
    return this.componentContent.starterDrawData != null;
  }

  setAuthoredBackgroundIfAvailable(useTimeout: boolean = false): void {
    if (this.isAuthoredBackgroundAvailable()) {
      if (useTimeout) {
        this.setAuthoredBackgroundAfterTimeout();
      } else {
        this.setBackgroundImage(this.componentContent.background);
      }
    }
  }

  isAuthoredBackgroundAvailable(): boolean {
    return this.componentContent.background != null && this.componentContent.background !== '';
  }

  setAuthoredBackgroundAfterTimeout(): void {
    // set the background after a timeout to make sure it gets set after the draw data is set.
    // if we don't do this, the background may not overwrite the existing background that is already
    // in the draw data.
    setTimeout(() => {
      this.setBackgroundImage(this.componentContent.background);
    }, 500);
  }

  setBackgroundImage(image: string): void {
    this.drawingTool.setBackgroundImage(image);
  }

  setDrawingChangedListener(): void {
    /*
     * Wait before we start listening for the drawing:changed event. We need to wait
     * because the calls above to this.drawingTool.setBackgroundImage() will cause
     * the drawing:changed event to be fired from the drawingTool, but when that happens,
     * we don't want to call this.studentDataChanged() because it marks the student work
     * as dirty. We only want to call this.studentDataChanged() when the drawing:changed
     * event occurs in response to the student changing the drawing and this timeout
     * will help make sure of that.
     */
    setTimeout(() => {
      this.drawingTool.on('drawing:changed', () => {
        this.studentDataChanged();
      });
    }, 500);
  }

  handleConnectedComponentsPostProcess(): void {
    this.setAuthoredBackgroundIfAvailable();
  }

  setStudentWork(componentState: any): void {
    this.setDrawData(componentState);
    this.setSubmitCounter(componentState);
    this.processLatestStudentWork();
  }

  resetDrawing(): void {
    if (confirm($localize`Are you sure you want to clear your drawing?`)) {
      this.drawingTool.clear();
      this.loadConnectedComponentOrStarterDrawDataIfAvailable();
      this.setAuthoredBackgroundIfAvailable(true);
      this.parentStudentWorkIds = null;
    }
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action: string): Promise<any> {
    const componentState = this.createComponentStateObject();
    this.isSubmit = false;
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  createComponentStateObject() {
    const componentState: any = this.createNewComponentState();
    const studentData: any = {
      drawData: this.getDrawData(),
      submitCounter: this.submitCounter
    };
    if (this.parentStudentWorkIds != null) {
      studentData.parentStudentWorkIds = this.parentStudentWorkIds;
    }
    componentState.studentData = studentData;
    componentState.isSubmit = this.isSubmit;
    componentState.componentType = 'Draw';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    if (this.isSubmit && this.hasDefaultFeedback()) {
      this.addDefaultFeedback(componentState);
    }
    return componentState;
  }

  handleStudentWorkSavedToServerAdditionalProcessing(componentState: any): void {
    if (this.isComponentStateFromConnectedComponent(componentState)) {
      const connectedComponent: any = this.ProjectService.getConnectedComponentParams(
        this.componentContent,
        componentState.componentId
      );
      if (this.isUpdateImmediately(connectedComponent, componentState) && this.isPerformUpdate()) {
        switch (componentState.componentType) {
          case 'Draw':
            componentState = copy(componentState);
            this.setDrawData(componentState);
            this.setAuthoredBackgroundIfAvailable(true);
            break;
          case 'ConceptMap':
          case 'Embedded':
          case 'Graph':
          case 'Label':
          case 'Table':
            this.importWorkAsBackground(componentState);
        }
        this.studentDataChanged();
      }
    }
  }

  isUpdateImmediately(connectedComponent: any, componentState: any): boolean {
    return (
      connectedComponent.updateOn === 'save' ||
      (connectedComponent.updateOn === 'submit' && componentState.isSubmit)
    );
  }

  isComponentStateFromConnectedComponent(componentState: any): boolean {
    return this.ProjectService.isConnectedComponent(
      this.nodeId,
      this.componentId,
      componentState.componentId
    );
  }

  isPerformUpdate(): boolean {
    return this.isCanvasEmpty() || confirm($localize`Do you want to update the connected drawing?`);
  }

  /**
   * Add student asset image as object in the drawing canvas
   * @param studentAsset
   */
  attachStudentAsset(studentAsset: any): void {
    fabric.Image.fromURL(studentAsset.url, (oImg: any) => {
      oImg.scaleToWidth(this.width);
      oImg.studentAssetId = studentAsset.id;
      this.setBackgroundImage(studentAsset.url);
    });
  }

  getDrawData(): any {
    return this.drawingTool.save();
  }

  setDrawData(componentState: any): void {
    const studentData = componentState.studentData;
    if (studentData.submitCounter != null) {
      this.submitCounter = studentData.submitCounter;
    }
    const drawData = studentData.drawData;
    if (drawData != null && drawData != '' && drawData != '{}') {
      this.drawingTool.load(drawData);
    }
  }

  /**
   * Check if the student has drawn anything
   * @returns whether the canvas is empty
   */
  isCanvasEmpty(): boolean {
    const objects = this.drawingTool.canvas.getObjects();
    return objects == null || objects.length === 0;
  }

  addToNotebook(): void {
    if (this.isDirty) {
      const studentWorkSavedToServerSubscription = this.StudentDataService.studentWorkSavedToServer$.subscribe(
        (componentState: any) => {
          if (this.isForThisComponent(componentState)) {
            this.addNoteWithImage(componentState.id);
            studentWorkSavedToServerSubscription.unsubscribe();
          }
        }
      );
      this.saveButtonClicked();
    } else {
      const componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
      this.addNoteWithImage(componentState.id);
    }
  }

  addNoteWithImage(componentStateId: number) {
    const pngFile = convertToPNGFile(this.getCanvas());
    this.NotebookService.addNote(this.StudentDataService.getCurrentNodeId(), pngFile, null, [
      componentStateId
    ]);
  }

  getCanvas(): any {
    return $(`#${this.drawingToolId} canvas`)[0];
  }

  /**
   * Create a component state with the merged student responses
   * @param componentStates an array of component states
   * @return a component state with the merged student responses
   */
  createMergedComponentState(componentStates: any[]): any {
    const allDrawCanvasObjects = [];
    for (const componentState of componentStates) {
      switch (componentState.componentType) {
        case 'Draw':
          allDrawCanvasObjects.push(...this.getDrawCanvasObjects(componentState));
          const backgroundImage = this.getDrawCanvasBackground(componentState);
          if (backgroundImage != null) {
            this.setBackgroundImage(backgroundImage);
          }
          break;
        case 'ConceptMap':
        case 'Embedded':
        case 'Graph':
        case 'Label':
        case 'Table':
          this.importWorkAsBackground(componentState);
      }
    }
    return this.createComponentStateWithCanvasObjects(allDrawCanvasObjects);
  }

  createComponentStateWithCanvasObjects(canvasObjects: any[]): any {
    const drawData: any = JSON.parse(this.getDrawData());
    drawData.canvas.objects = canvasObjects;
    const componentState: any = this.createNewComponentState();
    componentState.studentData = {
      drawData: JSON.stringify(drawData)
    };
    return componentState;
  }

  getDrawCanvasObjects(componentState: any): any[] {
    const studentData = componentState.studentData;
    const drawDataJSON = JSON.parse(studentData.drawData);
    return drawDataJSON.canvas.objects;
  }

  getDrawCanvasBackground(componentState: any): string {
    const studentData = componentState.studentData;
    const drawDataJSON = JSON.parse(studentData.drawData);
    if (drawDataJSON.canvas.backgroundImage != null) {
      return drawDataJSON.canvas.backgroundImage.src;
    }
    return null;
  }

  generateStarterState(): any {
    return this.getDrawData();
  }
}
