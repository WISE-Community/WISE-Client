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
  width: number = 800;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    private DrawService: DrawService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private ProjectService: ProjectService,
    protected sanitizer: DomSanitizer,
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
      sanitizer,
      StudentAssetService,
      StudentDataService,
      upgrade,
      UtilService
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.drawingToolId = `drawingtool_${this.nodeId}_${this.componentId}`;
    this.showCopyPublicNotebookItemButton = this.ProjectService.isSpaceExists('public');
    if (this.isDisabled) {
      this.isResetButtonVisible = false;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeDrawingTool();
    });
  }

  handleStudentWorkSavedToServerAdditionalProcessing(componentState: any) {
    if (
      this.isForThisComponent(componentState) &&
      this.ProjectService.isConnectedComponent(
        this.nodeId,
        this.componentId,
        componentState.componentId
      )
    ) {
      // Fix me
      // const connectedComponentParams: any = this.ProjectService.getConnectedComponentParams(
      //   this.componentContent,
      //   componentState.componentId
      // );
      // if (connectedComponentParams != null) {
      //   if (
      //     connectedComponentParams.updateOn === 'save' ||
      //     (connectedComponentParams.updateOn === 'submit' && componentState.isSubmit)
      //   ) {
      //     let performUpdate = false;
      //     /*
      //      * make a copy of the component state so we don't accidentally
      //      * change any values in the referenced object
      //      */
      //     componentState = this.UtilService.makeCopyOfJSONObject(componentState);
      //     if (this.isCanvasEmpty()) {
      //       performUpdate = true;
      //     } else {
      //       // the student has drawn on the canvas so we will ask them if they want to update it
      //       if (confirm($localize`Do you want to update the connected drawing?`)) {
      //         performUpdate = true;
      //       }
      //     }
      //     if (performUpdate) {
      //       if (!connectedComponentParams.includeBackground) {
      //         this.DrawService.removeBackgroundFromComponentState(componentState);
      //       }
      //       this.setDrawData(componentState);
      //       this.$scope.drawController.isDirty = true;
      //       this.$scope.drawController.isSubmitDirty = true;
      //     }
      //     /*
      //      * remember the component state and connected component params
      //      * in case we need to use them again later
      //      */
      //     this.latestConnectedComponentState = componentState;
      //     this.latestConnectedComponentParams = connectedComponentParams;
      //   }
      // }
    }
  }

  handleNodeSubmit() {
    this.submit('nodeSubmitButton');
  }

  initializeDrawingTool() {
    this.drawingTool = this.DrawService.initializeDrawingTool(
      this.drawingToolId,
      this.componentContent.stamps,
      this.width,
      this.height
    );
    const componentState = this.componentState;
    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (
      this.DrawService.componentStateHasStudentWork(componentState, this.componentContent)
    ) {
      this.setStudentWork(componentState);
    } else if (this.UtilService.hasConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (
      componentState == null ||
      !this.DrawService.componentStateHasStudentWork(componentState, this.componentContent)
    ) {
      if (this.componentContent.starterDrawData != null) {
        this.drawingTool.load(this.componentContent.starterDrawData);
      }
      if (this.componentContent.background != null) {
        this.drawingTool.setBackgroundImage(this.componentContent.background);
      }
    }

    if (this.hasMaxSubmitCount() && this.hasSubmitsLeft()) {
      this.isSubmitButtonDisabled = true;
    }

    this.disableComponentIfNecessary();

    /*
     * Wait before we start listening for the drawing:changed event. We need to wait
     * because the calls above to this.drawingTool.setBackgroundImage() will cause
     * the drawing:changed event to be fired from the drawingTool, but when that happens,
     * we don't want to call this.studentDataChanged() because it marks the student work
     * as dirty. We only want to call this.studentDataChanged() when the drawing:changed
     * event occurs in response to the student changing the drawing and this timeout
     * will help make sure of that.
     */
    // setTimeout(() => {
    //   this.drawingTool.on('drawing:changed', this.studentDataChanged());
    // }, 500);

    this.drawingTool.on('tool:changed', (toolName) => {
      const category = 'Tool';
      const event = 'toolSelected';
      const data = {
        selectedToolName: toolName
      };
      this.StudentDataService.saveComponentEvent(this, category, event, data);
    });

    this.setupTools();

    if (this.isDisabled) {
      this.drawingTool.canvas.removeListeners();
    }
  }

  handleConnectedComponentsPostProcess() {
    if (this.componentContent.background != null) {
      this.drawingTool.setBackgroundImage(this.componentContent.background);
    }
  }

  /**
   * Setup the tools that we will make available to the student
   */
  setupTools() {
    const tools = this.componentContent.tools;
    if (tools == null) {
      // we will display all the tools
    } else {
      // we will only display the tools the authored specified to show
      const drawingTool = $('#' + this.drawingToolId);
      this.setupSelectTool(drawingTool, tools);
      this.setupLineTool(drawingTool, tools);
      this.setupShapeTool(drawingTool, tools);
      this.setupFreeHandTool(drawingTool, tools);
      this.setupTextTool(drawingTool, tools);
      this.setupStampTool(drawingTool, tools);
      this.setupCloneTool(drawingTool, tools);
      this.setupStrokeColorTool(drawingTool, tools);
      this.setupFillColorTool(drawingTool, tools);
      this.setupStrokeWidthTool(drawingTool, tools);
      this.setupSendBackTool(drawingTool, tools);
      this.setupSendForwardTool(drawingTool, tools);
      this.setupUndoTool(drawingTool, tools);
      this.setupRedoTool(drawingTool, tools);
      this.setupDeleteTool(drawingTool, tools);
      if (this.isDisabled) {
        drawingTool.find('.dt-tools').hide();
      }
    }
  }

  setupSelectTool(drawingTool, tools) {
    const selectTitle = $localize`Select tool`;
    if (tools.select) {
      drawingTool.find('[title="' + selectTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + selectTitle + '"]').hide();
    }
  }

  setupLineTool(drawingTool, tools) {
    const lineTitle = $localize`Line tool (click and hold to show available line types)`;
    if (tools.line) {
      drawingTool.find('[title="' + lineTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + lineTitle + '"]').hide();
    }
  }

  setupShapeTool(drawingTool, tools) {
    const shapeTitle = $localize`Basic shape tool (click and hold to show available shapes)`;
    if (tools.shape) {
      drawingTool.find('[title="' + shapeTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + shapeTitle + '"]').hide();
    }
  }

  setupFreeHandTool(drawingTool, tools) {
    const freeHandTitle = $localize`Free hand drawing tool`;
    if (tools.freeHand) {
      drawingTool.find('[title="' + freeHandTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + freeHandTitle + '"]').hide();
    }
  }

  setupTextTool(drawingTool, tools) {
    const textTitle = $localize`Text tool (click and hold to show available font sizes)`;
    if (tools.text) {
      drawingTool.find('[title="' + textTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + textTitle + '"]').hide();
    }
  }

  setupStampTool(drawingTool, tools) {
    const stampTitle = $localize`Stamp tool (click and hold to show available categories)`;
    if (tools.stamp) {
      drawingTool.find('[title="' + stampTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + stampTitle + '"]').hide();
    }
  }

  setupCloneTool(drawingTool, tools) {
    const cloneTitle = $localize`Clone tool`;
    if (tools.clone) {
      drawingTool.find('[title="' + cloneTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + cloneTitle + '"]').hide();
    }
  }

  setupStrokeColorTool(drawingTool, tools) {
    const strokeColorTitle = $localize`Stroke color (click and hold to show available colors)`;
    if (tools.strokeColor) {
      drawingTool.find('[title="' + strokeColorTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + strokeColorTitle + '"]').hide();
    }
  }

  setupFillColorTool(drawingTool, tools) {
    const fillColorTitle = $localize`Fill color (click and hold to show available colors)`;
    if (tools.fillColor) {
      drawingTool.find('[title="' + fillColorTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + fillColorTitle + '"]').hide();
    }
  }

  setupStrokeWidthTool(drawingTool, tools) {
    const strokeWidthTitle = $localize`Stroke width (click and hold to show available options)`;
    if (tools.strokeWidth) {
      drawingTool.find('[title="' + strokeWidthTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + strokeWidthTitle + '"]').hide();
    }
  }

  setupSendBackTool(drawingTool, tools) {
    const sendBackTitle = $localize`Send selected objects to back`;
    if (tools.sendBack) {
      drawingTool.find('[title="' + sendBackTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + sendBackTitle + '"]').hide();
    }
  }

  setupSendForwardTool(drawingTool, tools) {
    const sendForwardTitle = $localize`Send selected objects to front`;
    if (tools.sendForward) {
      drawingTool.find('[title="' + sendForwardTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + sendForwardTitle + '"]').hide();
    }
  }

  setupUndoTool(drawingTool, tools) {
    const undoTitle = $localize`Undo`;
    if (tools.undo) {
      drawingTool.find('[title="' + undoTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + undoTitle + '"]').hide();
    }
  }

  setupRedoTool(drawingTool, tools) {
    const redoTitle = $localize`Redo`;
    if (tools.redo) {
      drawingTool.find('[title="' + redoTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + redoTitle + '"]').hide();
    }
  }

  setupDeleteTool(drawingTool, tools) {
    const deleteTitle = $localize`Delete selected objects`;
    if (tools.delete) {
      drawingTool.find('[title="' + deleteTitle + '"]').show();
    } else {
      drawingTool.find('[title="' + deleteTitle + '"]').hide();
    }
  }

  setStudentWork(componentState) {
    if (componentState != null) {
      this.setDrawData(componentState);
      this.processLatestStudentWork();
    }
  }

  resetButtonClicked() {
    if (confirm($localize`Are you sure you want to clear your drawing?`)) {
      this.drawingTool.clear();
      if (this.UtilService.hasConnectedComponent(this.componentContent)) {
        this.handleConnectedComponents();
      } else if (this.latestConnectedComponentState) {
        this.setDrawData(this.latestConnectedComponentState);
      } else if (this.componentContent.starterDrawData != null) {
        this.drawingTool.load(this.componentContent.starterDrawData);
      }
      if (this.componentContent.background != null && this.componentContent.background != '') {
        this.drawingTool.setBackgroundImage(this.componentContent.background);
      }
      this.parentStudentWorkIds = null;
    }
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action) {
    const componentState: any = this.NodeService.createNewComponentState();
    const studentData: any = {};
    const studentDataJSONString = this.getDrawData();
    studentData.drawData = studentDataJSONString;
    studentData.submitCounter = this.submitCounter;
    if (this.parentStudentWorkIds != null) {
      studentData.parentStudentWorkIds = this.parentStudentWorkIds;
    }
    componentState.isSubmit = this.isSubmit;
    componentState.studentData = studentData;
    componentState.componentType = 'Draw';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    this.isSubmit = false;
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  /**
   * Add student asset images as objects in the drawing canvas
   * @param studentAsset
   */
  attachStudentAsset(studentAsset) {
    this.StudentAssetService.copyAssetForReference(studentAsset).then((copiedAsset) => {
      fabric.Image.fromURL(copiedAsset.url, (oImg) => {
        oImg.scaleToWidth(200); // set max width and have height scale proportionally
        // TODO: center image or put them at mouse position? Wasn't straight-forward, tried below but had issues...
        //oImg.setLeft((this.drawingTool.canvas.width / 2) - (oImg.width / 2));  // center image vertically and horizontally
        //oImg.setTop((this.drawingTool.canvas.height / 2) - (oImg.height / 2));
        //oImg.center();
        oImg.studentAssetId = copiedAsset.id; // keep track of this asset id
        this.drawingTool.canvas.add(oImg); // add copied asset image to canvas
      });
    });
  }

  getDrawData() {
    return this.drawingTool.save();
  }

  /**
   * Get the image object representation of the student data
   * @returns an image object
   */
  getImageObject() {
    if (this.drawingTool != null && this.drawingTool.canvas != null) {
      const canvasBase64Image = this.drawingTool.canvas.toDataURL('image/png');
      return this.UtilService.getImageObjectFromBase64String(canvasBase64Image);
    }
    return null;
  }

  setDrawData(componentState) {
    if (componentState != null) {
      const studentData = componentState.studentData;
      if (studentData.submitCounter != null) {
        this.submitCounter = studentData.submitCounter;
      }
      const drawData = studentData.drawData;
      if (drawData != null && drawData != '' && drawData != '{}') {
        this.drawingTool.load(drawData);
      }
    }
  }

  /**
   * Check if the student has drawn anything
   * @returns whether the canvas is empty
   */
  isCanvasEmpty() {
    if (this.drawingTool != null && this.drawingTool.canvas != null) {
      const objects = this.drawingTool.canvas.getObjects();
      if (objects != null && objects.length > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Snip the drawing by converting it to an image
   * @param $event the click event
   */
  snipDrawing($event, studentWorkId) {
    // let canvas = angular.element(
    //   document.querySelector('#drawingtool_' + this.nodeId + '_' + this.componentId + ' canvas')
    // );
    let canvas: any = $(`#drawing-tool-${this.nodeId}-${this.componentId}`);
    if (canvas != null && canvas.length > 0) {
      canvas = canvas[0];
      const canvasBase64Image = canvas.toDataURL('image/png');
      const imageObject = this.UtilService.getImageObjectFromBase64String(canvasBase64Image);
      const noteText = null;
      this.NotebookService.addNote(imageObject, noteText, [studentWorkId]);
    }
  }

  snipButtonClicked($event) {
    if (this.isDirty) {
      const studentWorkSavedToServerSubscription = this.StudentDataService.studentWorkSavedToServer$.subscribe(
        (componentState: any) => {
          if (this.isForThisComponent(componentState)) {
            this.snipDrawing($event, componentState.id);
            studentWorkSavedToServerSubscription.unsubscribe();
          }
        }
      );
      this.saveButtonClicked();
    } else {
      const studentWork = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
      this.snipDrawing($event, studentWork.id);
    }
  }

  /**
   * Create a component state with the merged student responses
   * @param componentStates an array of component states
   * @return a component state with the merged student responses
   */
  createMergedComponentState(componentStates) {
    const mergedComponentState: any = this.NodeService.createNewComponentState();
    if (componentStates != null) {
      let allDrawCanvasObjects = [];
      let firstDrawData = {};
      for (let c = 0; c < componentStates.length; c++) {
        const componentState = componentStates[c];
        if (componentState.componentType == 'Draw') {
          const studentData = componentState.studentData;
          const drawData = studentData.drawData;
          const drawDataJSON = JSON.parse(drawData);
          if (
            drawDataJSON != null &&
            drawDataJSON.canvas != null &&
            drawDataJSON.canvas.objects != null
          ) {
            if (c == 0) {
              firstDrawData = drawDataJSON;
            }
            allDrawCanvasObjects = allDrawCanvasObjects.concat(drawDataJSON.canvas.objects);
          }
        } else if (
          componentState.componentType == 'Graph' ||
          componentState.componentType == 'ConceptMap' ||
          componentState.componentType == 'Embedded' ||
          componentState.componentType == 'Label' ||
          componentState.componentType == 'Table'
        ) {
          const connectedComponent = this.UtilService.getConnectedComponentByComponentState(
            this.componentContent,
            componentState
          );
          if (connectedComponent.importWorkAsBackground === true) {
            this.setComponentStateAsBackgroundImage(componentState);
          }
        }
      }
      if (allDrawCanvasObjects != null) {
        const drawData: any = firstDrawData;
        if (drawData.canvas != null && drawData.canvas.objects != null) {
          drawData.canvas.objects = allDrawCanvasObjects;
        }
        mergedComponentState.studentData = {};
        mergedComponentState.studentData.drawData = JSON.stringify(drawData);
      }
    }
    return mergedComponentState;
  }

  /**
   * Create an image from a component state and set the image as the background.
   * @param componentState A component state.
   */
  setComponentStateAsBackgroundImage(componentState) {
    this.generateImageFromComponentState(componentState).then((image) => {
      this.drawingTool.setBackgroundImage(image.url);
    });
  }

  generateStarterState() {
    this.NodeService.respondStarterState({
      nodeId: this.nodeId,
      componentId: this.componentId,
      starterState: this.getDrawData()
    });
  }
}
