import { fabric } from 'fabric';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { LabelService } from '../labelService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { convertToPNGFile } from '../../../common/canvas/canvas';
import { wordWrap } from '../../../common/string/string';
import { hasConnectedComponent } from '../../../common/ComponentContent';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { AddToNotebookButtonComponent } from '../../../directives/add-to-notebook-button/add-to-notebook-button.component';
import { ComponentSaveSubmitButtonsComponent } from '../../../directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentAnnotationsComponent } from '../../../directives/componentAnnotations/component-annotations.component';
import { LabelStudentData } from '../LabelStudentData';

@Component({
  imports: [
    AddToNotebookButtonComponent,
    ComponentAnnotationsComponent,
    ComponentHeaderComponent,
    ComponentSaveSubmitButtonsComponent,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  selector: 'label-student',
  styleUrl: 'label-student.component.scss',
  templateUrl: 'label-student.component.html'
})
export class LabelStudentComponent extends ComponentStudent {
  protected addNewLabelButtonVisible: boolean = true;
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
    protected annotationService: AnnotationService,
    private changeDetector: ChangeDetectorRef,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    private labelService: LabelService,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.enableFabricTextPadding();
    const domIdEnding = this.labelService.getDomIdEnding(
      this.nodeId,
      this.componentId,
      this.componentState
    );
    this.canvasId = this.labelService.getCanvasId(domIdEnding);
    this.initializeComponent(this.componentContent);
  }

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.broadcastDoneRenderingComponent();
    this.changeDetector.detectChanges(); // prevents dev-mode change detection error
  }

  private enableFabricTextPadding(): void {
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
    this.addNewLabelButtonVisible = componentContent.canCreateLabels && !this.isDisabled;
    if (this.onlyHasShowWorkConnectedComponents()) {
      this.isDisabled = true;
    }
    if (this.isDisabled) {
      this.isResetButtonVisible = false;
    }
  }

  private setupCanvas(): void {
    this.canvas = this.labelService.initializeCanvas(
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

  private registerMouseDownListener(): void {
    this.canvas.on('mouse:down', (options: any) => {
      if (this.canvas.getActiveObject() == null) {
        // no objects in the canvas were clicked
        this.unselectAll();
      }
    });
  }

  private unselectAll(): void {
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
    } else if (this.labelService.componentStateHasStudentWork(componentState, componentContent)) {
      this.setStudentWork(componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
      if (componentContent.labels != null) {
        this.setStarterLabels(componentContent);
      }
    } else if (this.labelService.componentStateIsSameAsStarter(componentState, componentContent)) {
      this.setStudentWork(componentState);
    } else if (componentState == null && componentContent.labels != null) {
      this.setStarterLabels(componentContent);
    }
  }

  private setStarterLabels(componentContent: any): void {
    // Make sure starter labels have isStarterLabel set to true. Starter labels from old Label
    // component content did not have this field.
    componentContent.labels.forEach((label: any) => (label.isStarterLabel = true));
    this.addLabelsToCanvas(componentContent.labels);
  }

  setStudentWork(componentState: any): void {
    const studentData = componentState.studentData;
    this.setStudentDataVersion(studentData.version == null ? 1 : studentData.version);
    this.addLabelsToCanvas(studentData.labels);
    this.setBackgroundImage(studentData.backgroundImage);
    this.submitCounter = studentData.submitCounter;
    this.processLatestStudentWork();
  }

  private addLabelsToCanvas(labels: any[]): void {
    const fabricLabels = this.labelService.addLabelsToCanvas(
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
    fabricLabels.forEach((label: any) => this.addListenersToLabel(label));
    fabricLabels.forEach((label: any) => this.labels.push(label));
  }

  protected addNewLabel(): void {
    const newLabelLocation = this.getNewLabelLocation();
    const newLabel = this.labelService.createLabel(
      newLabelLocation.pointX,
      newLabelLocation.pointY,
      newLabelLocation.textX,
      newLabelLocation.textY,
      $localize`A New Label`,
      'blue',
      true,
      true,
      this.componentContent.canvasWidth,
      this.componentContent.canvasHeight,
      this.componentContent.pointSize,
      this.componentContent.fontSize,
      this.componentContent.labelWidth,
      this.studentDataVersion,
      this.labelService.getTimestamp(),
      false
    );
    this.labelService.addLabelToCanvas(this.canvas, newLabel, this.enableCircles);
    this.addListenersToLabel(newLabel);
    this.labels.push(newLabel);
    this.selectLabel(newLabel);
    this.studentDataChanged();
  }

  getLabelData(): any[] {
    const labels = this.canvas
      .getObjects('i-text')
      .map((object: any) => this.getLabelJSONObjectFromText(object));
    labels.sort((labelA: any, labelB: any) => labelA.timestamp - labelB.timestamp);
    return labels;
  }

  getTextCoordinate(fabricObject: any): any {
    let textX: number;
    let textY: number;
    if (this.studentDataVersion == 1) {
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
    const label = this.labels.find((label: any) => label.text == text);
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
    componentState.studentData = new LabelStudentData(
      this.getLabelData(),
      this.backgroundImage,
      this.submitCounter,
      this.studentDataVersion
    );
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

  private getNewLabelLocation(): any {
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

  private getNextPointLocation(): any {
    return (
      this.getUnoccupiedPointLocation() || {
        pointX: this.NEW_LABEL_X_LOCATION,
        pointY: this.NEW_LABEL_Y_LOCATION
      }
    );
  }

  private getNextTextLocation(pointX: number, pointY: number): any {
    let textX = null;
    let textY = null;
    if (this.enableCircles) {
      // place the text to the bottom right of the circle
      if (this.studentDataVersion == 1) {
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

  private isPointOccupied(occupiedPointLocations: any[], pointX: number, pointY: number): boolean {
    return occupiedPointLocations.some(
      (location) => location.pointX == pointX && location.pointY == pointY
    );
  }

  getUnoccupiedPointLocation(): any {
    const occupiedPointLocations = this.getLabelData().map((label) => ({
      pointX: label.pointX,
      pointY: label.pointY
    }));
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
    return this.labels.find((label: any) => label.circle == circle);
  }

  private addListenersToLabel(label: any): void {
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
  private selectLabel(label: any): void {
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

  private wrapTextIfNecessary(text: string): string {
    let wrappedText = text;
    if (this.componentContent.labelWidth != null && this.componentContent.labelWidth !== '') {
      wrappedText = wordWrap(text, this.componentContent.labelWidth);
    }
    return wrappedText;
  }

  private removeLabelFromCanvas(canvas: any, label: any): void {
    canvas.remove(label.circle);
    canvas.remove(label.line);
    canvas.remove(label.text);
  }

  snipImage(): void {
    this.notebookService.addNote(
      this.studentDataService.getCurrentNodeId(),
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
      studentData: new LabelStudentData()
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
        this.labelService
          .createImageFromText(
            response,
            null,
            null,
            charactersPerLine,
            null,
            spaceInbetweenLines,
            fontSize
          )
          .then((image: string) => {
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

  protected reset(): void {
    if (confirm($localize`Are you sure you want to reset to the initial state?`)) {
      this.labels.forEach((label: any) => this.removeLabelFromCanvas(this.canvas, label));
      this.labels = [];
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

  setStudentDataVersion(studentDataVersion: number): void {
    this.studentDataVersion = studentDataVersion;
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

  protected deleteBackgroundImage(): void {
    if (confirm($localize`Are you sure you want to delete the background image?`)) {
      this.setBackgroundImage(null);
      this.studentDataChanged();
    }
  }
}
