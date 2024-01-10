import { fabric } from 'fabric';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { LabelService } from '../labelService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { MatDialog } from '@angular/material/dialog';
import { convertToPNGFile } from '../../../common/canvas/canvas';
import { wordWrap } from '../../../common/string/string';
import { hasConnectedComponent } from '../../../common/ComponentContent';

@Component({
  selector: 'label-student',
  templateUrl: 'label-student.component.html',
  styleUrls: ['label-student.component.scss']
})
export class LabelStudent extends ComponentStudent {
  backgroundImage: string;
  canvas: any;
  canvasHeight: number = 600;
  canvasId: string;
  canvasWidth: number = 800;
  circleZIndex: number = 2;
  disabled: boolean;
  editLabelMode: boolean = false;
  enableCircles: boolean = true;
  ENTER_KEY_CODE: number = 13;
  isAddNewLabelButtonVisible: boolean = true;
  isResetButtonVisible: boolean = true;
  labels: any[] = [];
  lineZIndex: number = 0;
  NEW_LABEL_X_LOCATION: number = 80;
  NEW_LABEL_Y_LOCATION: number = 80;
  selectedLabel: any;
  selectedLabelText: any;
  SPACE_BETWEEN_LABELS: number = 200;

  // Student data version 1 is where the text x and y positioning is relative to the circle.
  // Student data version 2 is where the text x and y positioning is absolute.
  studentDataVersion: number = 2;
  textZIndex: number = 1;

  constructor(
    protected AnnotationService: AnnotationService,
    private changeDetector: ChangeDetectorRef,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    private LabelService: LabelService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
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
    this.enableFabricTextPadding();
    const domIdEnding = this.LabelService.getDomIdEnding(
      this.nodeId,
      this.componentId,
      this.componentState
    );
    this.canvasId = this.LabelService.getCanvasId(domIdEnding);
    this.initializeComponent(this.componentContent);
  }

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.broadcastDoneRenderingComponent();
    this.changeDetector.detectChanges(); // prevents dev-mode change detection error
  }

  enableFabricTextPadding(): void {
    // modify Fabric so that Text elements can utilize padding
    fabric.Text.prototype.set({
      _getNonTransformedDimensions() {
        // Object dimensions
        return new fabric.Point(this.width, this.height).scalarAdd(this.padding);
      },
      _calculateCurrentDimensions() {
        // Controls dimensions
        return fabric.util.transformPoint(
          this._getTransformedDimensions(),
          this.getViewportTransform(),
          true
        );
      }
    });
  }

  initializeComponent(componentContent: any): void {
    this.canvasWidth = componentContent.width;
    this.canvasHeight = componentContent.height;
    this.enableCircles = componentContent.enableCircles;
    this.isSaveButtonVisible = componentContent.showSaveButton;
    this.isSubmitButtonVisible = componentContent.showSubmitButton;
    this.isAddNewLabelButtonVisible = componentContent.canCreateLabels;
    if (this.onlyHasShowWorkConnectedComponents()) {
      this.isDisabled = true;
    }
    if (this.isDisabled) {
      this.isAddNewLabelButtonVisible = false;
      this.isResetButtonVisible = false;
    }
  }

  setupCanvas(): void {
    this.canvas = this.LabelService.initializeCanvas(
      this.canvasId,
      this.canvasWidth,
      this.canvasHeight,
      this.isDisabled
    );
    this.registerMouseDownListener();
    this.registerObjectMovingListener();
    this.registerTextChangedListener();
    if (!this.disabled) {
      this.createKeydownListener();
    }
    this.initializeStudentWork(this.componentContent, this.componentState);
    if (
      this.backgroundImage == null &&
      this.componentContent.backgroundImage != null &&
      this.componentContent.backgroundImage !== ''
    ) {
      this.setBackgroundImage(this.componentContent.backgroundImage);
    }
    if (this.hasMaxSubmitCount() && !this.hasSubmitsLeft()) {
      this.isSubmitButtonDisabled = true;
    }
    this.disableComponentIfNecessary();
  }

  registerMouseDownListener(): void {
    this.canvas.on('mouse:down', (options: any) => {
      if (this.canvas.getActiveObject() == null) {
        // no objects in the canvas were clicked
        this.unselectAll();
      }
    });
  }

  unselectAll(): void {
    this.selectedLabel = null;
    this.editLabelMode = false;
    this.canvas.discardActiveObject();
  }

  registerObjectMovingListener(): void {
    this.canvas.on('object:moving', (options: any) => {
      const target = options.target;
      const top = this.limitObjectYPosition(target);
      const left = this.limitObjectXPosition(target);
      const type = target.get('type');
      if (type === 'circle') {
        this.handleMovingCircle(target, top, left);
      } else if (type === 'i-text') {
        this.handleMovingText(target, top, left);
      }
      this.canvas.renderAll();
      this.studentDataChanged();
    });
  }

  /**
   * Make sure the object is within the width bounds of the canvas.
   * @param target The fabric object.
   * @returns The x (aka left) position of the object after we have made sure it is within the
   * bounds of the canvas.
   */
  limitObjectXPosition(target: any): number {
    let left = target.get('left');
    if (left < 0) {
      left = 0;
      target.set('left', left);
    } else if (left > this.canvasWidth) {
      left = this.canvasWidth;
      target.set('left', left);
    }
    return left;
  }

  /**
   * Make sure the object is within the height bounds of the canvas.
   * @param target The fabric object.
   * @returns The y (aka top) position of the object after we have made sure it is within the
   * bounds of the canvas.
   */
  limitObjectYPosition(target: any): number {
    let top = target.get('top');
    if (top < 0) {
      top = 0;
      target.set('top', top);
    } else if (top > this.canvasHeight) {
      top = this.canvasHeight;
      target.set('top', top);
    }
    return top;
  }

  handleMovingCircle(circleObject: any, top: number, left: number): void {
    // The student is moving the point of the label so we need to update the endpoint of the line
    // and the position of the text element. The endpoint of the line and the position of the text
    // element should maintain the relative position to the point.
    let xDiff = 0;
    let yDiff = 0;

    const line = circleObject.line;
    if (line != null) {
      if (this.studentDataVersion === 1) {
        xDiff = line.x2 - line.x1;
        yDiff = line.y2 - line.y1;
        line.set({ x1: left, y1: top, x2: left + xDiff, y2: top + yDiff });
      } else {
        line.set({ x1: left, y1: top });
      }
      this.refreshFabricObject(line);
      this.refreshZIndex(line, this.lineZIndex);
    }

    const text = circleObject.text;
    if (text != null) {
      if (this.studentDataVersion === 1) {
        // In the old student data version the text position is relative to the circle so we need to
        // move the text along with the circle.
        text.set({ left: left + xDiff, top: top + yDiff });
        this.refreshFabricObject(text);
        this.refreshZIndex(text, this.textZIndex);
      }
    }
  }

  refreshFabricObject(fabricObject: any): void {
    this.canvas.remove(fabricObject);
    this.canvas.add(fabricObject);
  }

  refreshZIndex(fabricObject: any, zIndex: number): void {
    this.canvas.moveTo(fabricObject, zIndex);
  }

  handleMovingText(textObject: any, top: number, left: number): void {
    if (this.enableCircles) {
      // The student is moving the text of the label so we need to update the endpoint of the line.
      // The endpoint of the line should be in the same position as the text element.
      const line = textObject.line;
      if (line != null) {
        line.set({ x2: left, y2: top });
        this.refreshFabricObject(line);
        this.refreshZIndex(line, this.lineZIndex);
      }
    } else {
      // We are only showing the text so we will set the circle position to be the same as the text
      // position.
      const circle = textObject.circle;
      const line = textObject.line;
      circle.set({ left: left, top: top });
      line.set({ x1: left, y1: top, x2: left, y2: top });
    }
  }

  registerTextChangedListener(): void {
    this.canvas.on('text:changed', (options: any) => {
      const target = options.target;
      if (target.get('type') === 'i-text') {
        this.studentDataChanged();
      }
    });
  }

  initializeStudentWork(componentContent: any, componentState: any): void {
    if (hasConnectedComponent(componentContent, 'showWork')) {
      this.handleConnectedComponents();
    } else if (this.LabelService.componentStateHasStudentWork(componentState, componentContent)) {
      this.setStudentWork(componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
      if (componentContent.labels != null) {
        this.setStarterLabels(componentContent);
      }
    } else if (this.LabelService.componentStateIsSameAsStarter(componentState, componentContent)) {
      this.setStudentWork(componentState);
    } else if (componentState == null && componentContent.labels != null) {
      this.setStarterLabels(componentContent);
    }
  }

  private setStarterLabels(componentContent: any): void {
    // Make sure starter labels have isStarterLabel set to true. Starter labels from old Label
    // component content did not have this field.
    this.setIsStarterLabelTrue(componentContent.labels);
    this.addLabelsToCanvas(componentContent.labels);
  }

  private setIsStarterLabelTrue(labels: any[]): void {
    for (const label of labels) {
      label.isStarterLabel = true;
    }
  }

  setStudentWork(componentState: any): void {
    const studentData = componentState.studentData;
    this.setStudentDataVersion(studentData.version == null ? 1 : studentData.version);
    this.addLabelsToCanvas(studentData.labels);
    this.setBackgroundImage(studentData.backgroundImage);
    this.submitCounter = studentData.submitCounter;
    this.processLatestStudentWork();
  }

  addLabelsToCanvas(labels: any[]): void {
    const fabricLabels = this.LabelService.addLabelsToCanvas(
      this.canvas,
      labels,
      this.canvasWidth,
      this.canvasHeight,
      this.componentContent.pointSize,
      this.componentContent.fontSize,
      this.componentContent.labelWidth,
      this.enableCircles,
      this.studentDataVersion
    );
    this.addListenersToLabels(fabricLabels);
    this.addLabelsToLocalArray(fabricLabels);
  }

  addLabelsToLocalArray(labels: any[]): void {
    labels.forEach((label: any) => {
      this.labels.push(label);
    });
  }

  addNewLabel(): void {
    this.createLabelOnCanvas();
  }

  /**
   * Get the label data from the canvas.
   * @returns An array of simple JSON objects that contain the label data.
   */
  getLabelData(): any[] {
    const labels = [];
    this.canvas.getObjects('i-text').forEach((object: any) => {
      labels.push(this.getLabelJSONObjectFromText(object));
    });
    labels.sort(this.sortByTimestampAscending);
    return labels;
  }

  private sortByTimestampAscending(labelA: any, labelB: any): number {
    return labelA.timestamp - labelB.timestamp;
  }

  /**
   * Get the simple JSON object that represents the label
   * @param circle a Fabric circle object
   * @returns a simple JSON object that represents the label
   */
  getLabelJSONObjectFromCircle(circle: any): any {
    const { textX, textY } = this.getTextCoordinate(circle);
    return {
      pointX: parseInt(circle.get('left')),
      pointY: parseInt(circle.get('top')),
      textX: parseInt(textX),
      textY: parseInt(textY),
      text: this.getLabelFromCircle(circle).textString,
      color: circle.text.backgroundColor
    };
  }

  getTextCoordinate(fabricObject: any): any {
    let textX: number;
    let textY: number;
    if (this.isStudentDataVersion(1)) {
      const lineObject = fabricObject.line;

      // get the offset of the end of the line (this is where the text object is also located)
      textX = lineObject.x2 - lineObject.x1;
      textY = lineObject.y2 - lineObject.y1;
    } else {
      const textObject = fabricObject.text;
      textX = textObject.left;
      textY = textObject.top;
    }
    return {
      textX: textX,
      textY: textY
    };
  }

  /**
   * Get the simple JSON object that represents the label
   * @param text a Fabric text object
   * @returns a simple JSON object that represents the label
   */
  getLabelJSONObjectFromText(text: any): any {
    const label = this.getLabelFromText(text);
    const circleObject = label.circle;
    const { textX, textY } = this.getTextCoordinate(label);
    return {
      pointX: parseInt(circleObject.get('left')),
      pointY: parseInt(circleObject.get('top')),
      textX: parseInt(textX),
      textY: parseInt(textY),
      text: label.textString,
      color: label.text.backgroundColor,
      canEdit: label.canEdit,
      canDelete: label.canDelete,
      timestamp: label.timestamp,
      isStarterLabel: label.isStarterLabel
    };
  }

  /**
   * Create a new component state populated with the student data.
   * @param action The action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return A promise that will return a component state.
   */
  createComponentState(action: string): Promise<any> {
    const componentState: any = this.createNewComponentState();
    const studentData: any = this.createStudentData(
      this.getLabelData(),
      this.backgroundImage,
      this.submitCounter,
      this.getStudentDataVersion()
    );
    componentState.studentData = studentData;
    componentState.isSubmit = this.isSubmit;
    componentState.componentType = 'Label';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    if (this.isSubmit && this.hasDefaultFeedback()) {
      this.addDefaultFeedback(componentState);
    }
    this.isSubmit = false;
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  createStudentData(
    labels: any[] = [],
    backgroundImage: string = null,
    submitCounter: number = 0,
    studentDataVersion: number = 2
  ): any {
    return {
      labels: labels,
      backgroundImage: backgroundImage,
      submitCounter: submitCounter,
      version: studentDataVersion
    };
  }

  createLabelOnCanvas(): void {
    const newLabelLocation = this.getNewLabelLocation();
    const canEdit = true;
    const canDelete = true;
    const isStarterLabel = false;
    const newLabel = this.LabelService.createLabel(
      newLabelLocation.pointX,
      newLabelLocation.pointY,
      newLabelLocation.textX,
      newLabelLocation.textY,
      $localize`A New Label`,
      'blue',
      canEdit,
      canDelete,
      this.componentContent.canvasWidth,
      this.componentContent.canvasHeight,
      this.componentContent.pointSize,
      this.componentContent.fontSize,
      this.componentContent.labelWidth,
      this.studentDataVersion,
      this.LabelService.getTimestamp(),
      isStarterLabel
    );
    this.LabelService.addLabelToCanvas(this.canvas, newLabel, this.enableCircles);
    this.addListenersToLabel(newLabel);
    this.labels.push(newLabel);
    this.selectLabel(newLabel);
    this.studentDataChanged();
  }

  getNewLabelLocation(): any {
    const nextPointLocation = this.getNextPointLocation();
    const pointX = nextPointLocation.pointX;
    const pointY = nextPointLocation.pointY;
    const newTextLocation = this.getNextTextLocation(pointX, pointY);
    const textX = newTextLocation.textX;
    const textY = newTextLocation.textY;
    return {
      pointX: pointX,
      pointY: pointY,
      textX: textX,
      textY: textY
    };
  }

  getNextPointLocation(): any {
    return (
      this.getUnoccupiedPointLocation() || {
        pointX: this.NEW_LABEL_X_LOCATION,
        pointY: this.NEW_LABEL_Y_LOCATION
      }
    );
  }

  getNextTextLocation(pointX: number, pointY: number): any {
    let textX = null;
    let textY = null;
    if (this.enableCircles) {
      // place the text to the bottom right of the circle
      if (this.isStudentDataVersion(1)) {
        // text is relatively positioned
        textX = 100;
        textY = 100;
      } else {
        // text is absolutely positioned
        textX = pointX + 100;
        textY = pointY + 100;
      }
    } else {
      // circles are not enabled so we are only using the text
      textX = pointX;
      textY = pointY;
    }
    return { textX: textX, textY: textY };
  }

  getOccupiedPointLocations(): any {
    const occupiedPointLocations = [];
    for (const label of this.getLabelData()) {
      occupiedPointLocations.push({ pointX: label.pointX, pointY: label.pointY });
    }
    return occupiedPointLocations;
  }

  isPointOccupied(occupiedPointLocations: any[], pointX: number, pointY: number): boolean {
    for (const occupiedPointLocation of occupiedPointLocations) {
      if (occupiedPointLocation.pointX == pointX && occupiedPointLocation.pointY == pointY) {
        return true;
      }
    }
    return false;
  }

  getUnoccupiedPointLocation(): any {
    const occupiedPointLocations = this.getOccupiedPointLocations();
    for (let y = this.NEW_LABEL_Y_LOCATION; y < this.canvasHeight; y += this.SPACE_BETWEEN_LABELS) {
      for (
        let x = this.NEW_LABEL_X_LOCATION;
        x < this.canvasWidth;
        x += this.SPACE_BETWEEN_LABELS
      ) {
        if (!this.isPointOccupied(occupiedPointLocations, x, y)) {
          return { pointX: x, pointY: y };
        }
      }
    }
    return null;
  }

  /**
   * @param backgroundImagePath the url path to an image or null to remove the background
   */
  setBackgroundImage(backgroundImagePath: string): void {
    this.backgroundImage = backgroundImagePath;
    this.canvas.setBackgroundImage(backgroundImagePath, this.canvas.renderAll.bind(this.canvas));
  }

  createKeydownListener(): void {
    window.addEventListener(
      'keydown',
      (e) => {
        this.keyPressed(e);
      },
      false
    );
  }

  keyPressed(e: any): void {
    if (e.keyCode === this.ENTER_KEY_CODE) {
      if (this.selectedLabel != null) {
        // treat the enter keypress as the intention of submitting any changes to the label text.
        this.unselectAll();
        this.canvas.renderAll();
      }
    }
  }

  /**
   * Get the label object given the canvas circle object.
   * @param circle A canvas circle object.
   * @return A label object.
   */
  getLabelFromCircle(circle: any): any {
    return this.labels.find((label: any) => {
      return label.circle == circle;
    });
  }

  /**
   * Get the label object given the canvas text object.
   * @param text A canvas text object.
   * @return A label object.
   */
  getLabelFromText(text: any): any {
    return this.labels.find((label: any) => {
      return label.text == text;
    });
  }

  makeSureXIsWithinXMinMaxLimits(x: number): number {
    return this.LabelService.makeSureValueIsWithinLimit(x, this.canvasWidth);
  }

  makeSureYIsWithinYMinMaxLimits(y: number): number {
    return this.LabelService.makeSureValueIsWithinLimit(y, this.canvasHeight);
  }

  addListenersToLabels(labels: any[]): void {
    labels.forEach((label: any) => {
      this.addListenersToLabel(label);
    });
  }

  addListenersToLabel(label: any): void {
    if (this.enableCircles) {
      label.circle.on('mousedown', () => {
        this.selectLabel(label);
      });
    }
    label.text.on('mousedown', () => {
      this.selectLabel(label);
    });
  }

  /**
   * Make the label selected which means we will show the UI elements to allow the text to be edited
   * and the button to delete the label.
   * @param label The label object.
   */
  selectLabel(label: any): void {
    this.selectedLabel = label;
    if (label.canEdit) {
      this.selectedLabelText = label.text.text;
      this.editLabelMode = true;
      this.canvas.setActiveObject(label.text);
      this.canvas.renderAll();
      this.giveFocusToLabelTextInput();
    } else {
      this.editLabelMode = false;
    }
  }

  giveFocusToLabelTextInput(): void {
    setTimeout(() => {
      // Get the y position of the top of the edit label text input. If this value is negative, it
      // means the element is above the currently viewable area and can not be seen. If the value is
      // positive, it means the element is currently in the viewable area and can be seen.
      const editLabelTextInput = $(`#editLabelTextInput-${this.componentId}`);
      const offset = editLabelTextInput.offset();
      const editLabelTextInputTop = offset.top;

      // Check if the edit label text input is viewable. We want to make sure the input is in view.
      // If the input is not in view and we give it focus, it will have the undesirable effect of
      // scrolling the view up so that the input comes into view. We don't want it to scroll because
      // it's jarring when the student is trying to select a label in the canvas.
      if (editLabelTextInputTop > 100) {
        // the input is in view so we will give it focus.
        editLabelTextInput.focus();
      }
    });
  }

  /**
   * The student has changed the label text on the selected label
   * @param label The label that has changed.
   * @param textObject The label's canvas text object.
   * @param textString The text string.
   */
  selectedLabelTextChanged(label: any, textObject: any, textString: string): void {
    label.textString = textString;
    textObject.text = this.wrapTextIfNecessary(textString);
    this.studentDataChanged();
    this.canvas.renderAll();
  }

  wrapTextIfNecessary(text: string): string {
    let wrappedText = text;
    if (this.componentContent.labelWidth != null && this.componentContent.labelWidth !== '') {
      wrappedText = wordWrap(text, this.componentContent.labelWidth);
    }
    return wrappedText;
  }

  /**
   * Remove a label from the canvas.
   * @param canvas The canvas.
   * @param label A canvas label object that contains a circle object, line object, and text object.
   */
  removeLabelFromCanvas(canvas: any, label: any): void {
    canvas.remove(label.circle);
    canvas.remove(label.line);
    canvas.remove(label.text);
  }

  snipImage(): void {
    this.NotebookService.addNote(
      this.StudentDataService.getCurrentNodeId(),
      convertToPNGFile(this.canvas)
    );
  }

  deleteLabelButtonClicked(): void {
    const selectedLabelText = this.selectedLabel.textString;
    if (confirm($localize`Are you sure you want to delete this label?\n\n${selectedLabelText}`)) {
      this.deleteLabel(this.selectedLabel);
      this.unselectAll();
      this.studentDataChanged();
    }
  }

  deleteLabel(label: any): void {
    this.removeLabelFromCanvas(this.canvas, label);
    this.removeLabelFromLocalArray(label);
  }

  removeLabelFromLocalArray(label: any): void {
    this.labels.splice(this.labels.indexOf(label), 1);
  }

  handleConnectedComponentsPostProcess(): void {
    if (
      this.componentContent.backgroundImage != null &&
      this.componentContent.backgroundImage != ''
    ) {
      this.setBackgroundImage(this.componentContent.backgroundImage);
    }
  }

  /**
   * Create a component state with the merged student responses
   * @param componentStates an array of component states
   * @return a component state with the merged student data
   */
  createMergedComponentState(componentStates: any[]): any {
    const componentStateTo: any = {
      studentData: this.createStudentData()
    };
    for (const componentState of componentStates) {
      switch (componentState.componentType) {
        case 'Label':
          this.mergeLabelComponentState(componentState, componentStateTo);
          break;
        case 'OpenResponse':
          this.mergeOpenResponseComponentState(componentState);
          break;
        case 'ConceptMap':
        case 'Draw':
        case 'Embedded':
        case 'Graph':
        case 'Table':
          this.importWorkAsBackground(componentState);
      }
    }
    return componentStateTo;
  }

  mergeLabelComponentState(componentStateFrom: any, componentStateTo: any): any {
    const studentDataFrom = componentStateFrom.studentData;
    const studentDataTo = componentStateTo.studentData;
    if (studentDataFrom.version != null) {
      studentDataTo.version = studentDataFrom.version;
    }
    componentStateTo.studentData.labels = componentStateTo.studentData.labels.concat(
      studentDataFrom.labels
    );
    const backgroundImage = studentDataFrom.backgroundImage;
    if (backgroundImage != null && backgroundImage != '') {
      studentDataTo.backgroundImage = backgroundImage;
    }
    return componentStateTo;
  }

  mergeOpenResponseComponentState(componentState: any): void {
    const connectedComponent = this.getConnectedComponentForComponentState(componentState);
    if (connectedComponent != null) {
      const response = componentState.studentData.response;
      if (connectedComponent.importWorkAsBackground) {
        const charactersPerLine = connectedComponent.charactersPerLine;
        const spaceInbetweenLines = connectedComponent.spaceInbetweenLines;
        const fontSize = connectedComponent.fontSize;
        this.LabelService.createImageFromText(
          response,
          null,
          null,
          charactersPerLine,
          null,
          spaceInbetweenLines,
          fontSize
        ).then((image: string) => {
          this.setBackgroundImage(image);
          this.studentDataChanged();
        });
      }
    }
  }

  getConnectedComponentForComponentState(componentState: any): any {
    for (const connectedComponent of this.componentContent.connectedComponents) {
      if (
        componentState.nodeId == connectedComponent.nodeId &&
        componentState.componentId == connectedComponent.componentId
      ) {
        return connectedComponent;
      }
    }
    return null;
  }

  resetButtonClicked(): void {
    if (confirm($localize`Are you sure you want to reset to the initial state?`)) {
      this.removeAllLabels();
      if (this.componentContent.backgroundImage != null) {
        this.setBackgroundImage(this.componentContent.backgroundImage);
      }
      this.unselectAll();
      this.setStarterLabels(this.componentContent);
      if (this.component.hasConnectedComponent()) {
        this.handleConnectedComponents();
      }
      this.studentDataChanged();
    }
  }

  removeAllLabels(): void {
    for (const label of this.labels) {
      this.removeLabelFromCanvas(this.canvas, label);
    }
    this.labels = [];
  }

  setStudentDataVersion(studentDataVersion: number): void {
    this.studentDataVersion = studentDataVersion;
  }

  getStudentDataVersion(): number {
    return this.studentDataVersion;
  }

  isStudentDataVersion(studentDataVersion: number): boolean {
    return this.getStudentDataVersion() == studentDataVersion;
  }

  onlyHasShowWorkConnectedComponents(): boolean {
    const connectedComponents = this.componentContent.connectedComponents;
    return (
      connectedComponents != null &&
      connectedComponents.length > 0 &&
      connectedComponents.length === this.getNumShowWorkConnectedComponents(connectedComponents)
    );
  }

  getNumShowWorkConnectedComponents(connectedComponents: any[]): number {
    let showWorkConnectedComponentCount = 0;
    for (const connectedComponent of connectedComponents) {
      if (connectedComponent.type === 'showWork') {
        showWorkConnectedComponentCount += 1;
      }
    }
    return showWorkConnectedComponentCount;
  }

  generateStarterState(): any {
    return this.getLabelData();
  }

  attachStudentAsset(studentAsset: any): any {
    this.setBackgroundImage(studentAsset.url);
  }

  deleteBackgroundImage(): void {
    if (confirm($localize`Are you sure you want to delete the background image?`)) {
      this.setBackgroundImage(null);
      this.studentDataChanged();
    }
  }
}
