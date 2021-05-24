import { fabric } from 'fabric';
import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { DrawService } from '../drawService';

@Component({
  selector: 'draw-student',
  templateUrl: 'draw-student.component.html',
  styleUrls: ['draw-student.component.scss', 'drawing-tool.scss'],
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
  toolFieldToLabel: any = {
    select: 'Select tool',
    line: 'Line tool (click and hold to show available line types)',
    shape: 'Basic shape tool (click and hold to show available shapes)',
    freeHand: 'Free hand drawing tool',
    text: 'Text tool (click and hold to show available font sizes)',
    stamp: 'Stamp tool (click and hold to show available categories)',
    strokeColor: 'Stroke color (click and hold to show available colors)',
    fillColor: 'Fill color (click and hold to show available colors)',
    clone: 'Clone tool',
    strokeWidth: 'Stroke width (click and hold to show available options)',
    sendBack: 'Send selected objects to back',
    sendForward: 'Send selected objects to front',
    undo: 'Undo',
    redo: 'Redo',
    delete: 'Delete selected objects'
  };
  width: number = 800;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    private DrawService: DrawService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected upgrade: UpgradeModule,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      upgrade,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.drawingToolId = this.DrawService.getDrawingToolId(this.nodeId, this.componentId);
    this.showCopyPublicNotebookItemButton = this.ProjectService.isSpaceExists('public');
    if (this.isDisabled) {
      this.isResetButtonVisible = false;
    }
    this.subscribeToNotebookItemChosen();
  }

  ngAfterViewInit(): void {
    this.initializeDrawingTool();
  }

  handleNodeSubmit(): void {
    this.submit('nodeSubmitButton');
  }

  initializeDrawingTool(): void {
    this.drawingTool = this.DrawService.initializeDrawingTool(
      this.drawingToolId,
      this.componentContent.stamps,
      this.width,
      this.height
    );
    this.initializeStudentData();
    this.disableComponentIfNecessary();
    this.setDrawingChangedListener();
    this.setToolChangedListener();
    this.setUpTools();

    if (this.hasMaxSubmitCount() && this.hasSubmitsLeft()) {
      this.isSubmitButtonDisabled = true;
    }

    if (this.isDisabled) {
      this.drawingTool.canvas.removeListeners();
    }
  }

  initializeStudentData(): void {
    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (
      this.DrawService.componentStateHasStudentWork(this.componentState, this.componentContent)
    ) {
      this.setStudentWork(this.componentState);
    } else if (this.UtilService.hasConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (this.isStarterDrawDataAvailable()) {
      this.drawingTool.load(this.componentContent.starterDrawData);
    }
    if (
      !this.DrawService.componentStateHasStudentWork(this.componentState, this.componentContent)
    ) {
      this.setAuthoredBackgroundIfNeeded();
    }
  }

  setAuthoredBackgroundIfNeeded() {
    if (this.isAuthoredBackgroundAvailable()) {
      this.setAuthoredBackgroundAfterTimeout();
    }
  }

  isStarterDrawDataAvailable(): boolean {
    return this.componentContent.starterDrawData != null;
  }

  isAuthoredBackgroundAvailable(): boolean {
    return this.componentContent.background != null && this.componentContent.background !== '';
  }

  setAuthoredBackgroundIfAvailable(): void {
    if (this.isAuthoredBackgroundAvailable()) {
      this.setBackgroundImage(this.componentContent.background);
    }
  }

  setBackgroundImage(image: string): void {
    this.drawingTool.setBackgroundImage(image);
  }

  setAuthoredBackgroundAfterTimeout(): void {
    // set the background after a timeout to make sure it gets set after the draw data is set.
    // if we don't do this, the background may not overwrite the existing background that is already
    // in the draw data.
    setTimeout(() => {
      this.setAuthoredBackgroundIfAvailable();
    }, 500);
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

  setToolChangedListener(): void {
    this.drawingTool.on('tool:changed', (toolName: string) => {
      const category = 'Tool';
      const event = 'toolSelected';
      const data = {
        selectedToolName: toolName
      };
      this.StudentDataService.saveComponentEvent(this, category, event, data);
    });
  }

  handleConnectedComponentsPostProcess(): void {
    this.setAuthoredBackgroundIfAvailable();
  }

  /**
   * Setup the tools that we will make available to the student.
   */
  setUpTools(): void {
    const tools = this.componentContent.tools;
    const drawingTool = $('#' + this.drawingToolId);
    const toolFields = Object.keys(tools);
    for (const toolField of toolFields) {
      this.setUpTool(drawingTool, tools, toolField, this.getToolFieldLabel(toolField));
    }
    if (this.isDisabled) {
      this.hideAllTools();
    }
  }

  getToolFieldLabel(toolField: string): string {
    return this.toolFieldToLabel[toolField];
  }

  setUpTool(drawingTool: any, tools: any, fieldName: string, title: string): void {
    if (tools[fieldName]) {
      drawingTool.find(`[title="${title}"]`).show();
    } else {
      drawingTool.find(`[title="${title}"]`).hide();
    }
  }

  hideAllTools() {
    $('#' + this.drawingToolId)
      .find('.dt-tools')
      .hide();
  }

  setStudentWork(componentState: any): void {
    this.setDrawData(componentState);
    this.processLatestStudentWork();
  }

  resetDrawing(): void {
    if (confirm($localize`Are you sure you want to clear your drawing?`)) {
      this.drawingTool.clear();
      if (this.UtilService.hasConnectedComponent(this.componentContent)) {
        this.handleConnectedComponents();
      } else if (this.componentContent.starterDrawData != null) {
        this.drawingTool.load(this.componentContent.starterDrawData);
      }
      this.setAuthoredBackgroundIfAvailable();
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
    const componentState: any = this.NodeService.createNewComponentState();
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
            componentState = this.UtilService.makeCopyOfJSONObject(componentState);
            this.setDrawData(componentState);
            this.setAuthoredBackgroundIfNeeded();
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
    const image = this.generateImageFromCanvas();
    this.NotebookService.addNote(image, null, [componentStateId]);
  }

  generateImageFromCanvas(): any {
    const canvasBase64Image = this.getCanvas().toDataURL('image/png');
    return this.UtilService.getImageObjectFromBase64String(canvasBase64Image);
  }

  getCanvas(): any {
    const canvas: any = $(`#${this.drawingToolId} canvas`);
    if (canvas != null && canvas.length > 0) {
      return canvas[0];
    } else {
      return null;
    }
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
    const componentState: any = this.NodeService.createNewComponentState();
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

  importWorkAsBackground(componentState: any): void {
    const connectedComponent = this.UtilService.getConnectedComponentByComponentState(
      this.componentContent,
      componentState
    );
    if (connectedComponent.importWorkAsBackground) {
      this.setComponentStateAsBackgroundImage(componentState);
    }
  }

  setComponentStateAsBackgroundImage(componentState: any): void {
    this.generateImageFromComponentState(componentState).then((image: any) => {
      this.setBackgroundImage(image.url);
    });
  }

  generateStarterState(): void {
    this.NodeService.respondStarterState({
      nodeId: this.nodeId,
      componentId: this.componentId,
      starterState: this.getDrawData()
    });
  }
}
