import SVG from 'svg.js';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { AnimationService } from '../animationService';
import { hasConnectedComponent } from '../../../common/ComponentContent';

@Component({
  selector: 'animation-student',
  templateUrl: 'animation-student.component.html',
  styleUrls: ['animation-student.component.scss']
})
export class AnimationStudent extends ComponentStudent {
  animationState: any = 'stopped';
  coordinateSystem: string = 'screen';
  draw: any;
  dataXOriginInPixels: number = 0;
  dataYOriginInPixels: number = 0;
  height: number = 600;
  idToSVGObject: any = {};
  idToWhetherAuthoredObjectIsAnimating: any = {};
  lastBroadcastTime: number;
  millisecondsPerDataTime: number;
  numTimesPlayClicked: number = 0;
  pixelsPerXUnit: number = 1;
  pixelsPerYUnit: number = 1;
  speedSliderValue: number = 3;
  speedToMillisecondsPerDataTime = {
    1: 10000,
    2: 1000,
    3: 100,
    4: 10,
    5: 1
  };
  svgId: string;
  timerText: any;
  width: number = 800;

  constructor(
    private AnimationService: AnimationService,
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
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
    const domIdEnding = this.AnimationService.getDomIdEnding(
      this.nodeId,
      this.componentId,
      this.componentState
    );
    this.svgId = this.AnimationService.getSvgId(domIdEnding);
    this.initializeCoordinates();

    if (hasConnectedComponent(this.componentContent, 'showWork')) {
      this.handleConnectedComponents();
    } else if (
      this.AnimationService.componentStateHasStudentWork(this.componentState, this.componentContent)
    ) {
      this.setStudentWork(this.componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
    }

    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableSubmitButton();
    }
    this.disableComponentIfNecessary();
    this.broadcastDoneRenderingComponent();
  }

  ngAfterViewInit(): void {
    this.setupSVG();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  setAnimationState(state: string): void {
    this.animationState = state;
  }

  setAnimationStateToPlaying(): void {
    this.setAnimationState('playing');
  }

  setAnimationStateToPaused(): void {
    this.setAnimationState('paused');
  }

  setAnimationStateToStopped(): void {
    this.setAnimationState('stopped');
  }

  setCoordinateSystem(coordinateSystem: string): void {
    this.coordinateSystem = coordinateSystem;
  }

  setCoordinateSystemToScreen(): void {
    this.setCoordinateSystem('screen');
  }

  setCoordinateSystemToCartesian(): void {
    this.setCoordinateSystem('cartesian');
  }

  initializeCoordinates(): void {
    this.initializeWidthValues();
    this.initializeHeightValues();
    this.initializeDataXOrigin();
    this.initializeDataYOrigin();
    this.initializeCoordinateSystem();
  }

  initializeWidthValues(): void {
    if (this.componentContent.widthInPixels != null && this.componentContent.widthInPixels !== '') {
      this.width = this.componentContent.widthInPixels;
      this.pixelsPerXUnit =
        this.componentContent.widthInPixels / this.componentContent.widthInUnits;
    }
  }

  initializeHeightValues(): void {
    if (
      this.componentContent.heightInPixels != null &&
      this.componentContent.heightInPixels !== ''
    ) {
      this.height = this.componentContent.heightInPixels;
      this.pixelsPerYUnit =
        this.componentContent.heightInPixels / this.componentContent.heightInUnits;
    }
  }

  initializeDataXOrigin(): void {
    if (
      this.componentContent.dataXOriginInPixels != null &&
      this.componentContent.dataXOriginInPixels !== ''
    ) {
      this.dataXOriginInPixels = this.componentContent.dataXOriginInPixels;
    }
  }

  initializeDataYOrigin(): void {
    if (
      this.componentContent.dataYOriginInPixels != null &&
      this.componentContent.dataYOriginInPixels !== ''
    ) {
      this.dataYOriginInPixels = this.componentContent.dataYOriginInPixels;
    }
  }

  initializeCoordinateSystem(): void {
    if (
      this.componentContent.coordinateSystem != null &&
      this.componentContent.coordinateSystem !== ''
    ) {
      this.coordinateSystem = this.componentContent.coordinateSystem;
    }
  }

  setupSVG(): void {
    this.draw = SVG(this.svgId);
    this.createSVGObjects();
    this.updateObjectDatasFromDataSources();
  }

  createSVGObjects(): void {
    for (const object of this.componentContent.objects) {
      let svgObject = null;
      const type = object.type;
      if (type === 'image') {
        svgObject = this.createSVGImage(object.image, object.width, object.height);
      } else if (type === 'text') {
        svgObject = this.createSVGText(object.text);
      }

      const id = object.id;
      this.addIdToSVGObject(id, svgObject);
      this.addIdToWhetherAuthoredObjectIsAnimating(id, false);
      this.initializeObjectPosition(object);
    }
  }

  createSVGImage(image: string, width: number, height: number): any {
    return this.draw.image(image, width, height);
  }

  createSVGText(text: string): any {
    if (text == null) {
      text = '';
    }
    return this.draw.text(text);
  }

  addIdToSVGObject(id: string, svgObject: any): void {
    this.idToSVGObject[id] = svgObject;
  }

  addIdToWhetherAuthoredObjectIsAnimating(id: string, isAnimating: boolean): void {
    this.idToWhetherAuthoredObjectIsAnimating[id] = isAnimating;
  }

  /**
   * Convert a data x value to a pixel x value.
   * @param {integer} x An x value in data units.
   * @return {integer} The x value converted to a pixel coordinate.
   */
  dataXToPixelX(x: number): number {
    if (x == null) {
      return this.dataXOriginInPixels;
    } else {
      return this.dataXOriginInPixels + x * this.pixelsPerXUnit;
    }
  }

  /**
   * Convert a data y value to a pixel y value.
   * @param {integer} y A y value in data units.
   * @return {integer} The y value converted to a pixel coordinate.
   */
  dataYToPixelY(y: number): number {
    if (y == null) {
      return this.dataYOriginInPixels;
    } else {
      return this.dataYOriginInPixels + y * this.pixelsPerYUnit;
    }
  }

  initializeObjectPosition(authoredObject: any): void {
    const x = this.getPixelXForAuthoredObject(authoredObject);
    let y = this.getPixelYForAuthoredObject(authoredObject);
    if (this.isUsingCartesianCoordinateSystem()) {
      y = this.convertToCartesianCoordinateSystem(y);
    }

    const svgObject = this.getSVGObject(authoredObject.id);
    this.setPositionOfSVGObject(svgObject, x, y);

    if (this.authoredObjectHasData(authoredObject)) {
      const data = authoredObject.data;
      if (this.hasDataPointAtTimeZero(data)) {
        const firstDataPoint = data[0];
        this.setPositionFromDataPoint(svgObject, firstDataPoint);
      }
    }
  }

  getPixelXForAuthoredObject(authoredObject: any): number {
    const dataX = authoredObject.dataX;
    const pixelX = authoredObject.pixelX;
    if (dataX != null) {
      return this.dataXToPixelX(dataX);
    } else if (pixelX != null) {
      return pixelX;
    }
  }

  getPixelYForAuthoredObject(authoredObject: any): number {
    const dataY = authoredObject.dataY;
    const pixelY = authoredObject.pixelY;
    if (dataY != null) {
      return this.dataYToPixelY(dataY);
    } else if (pixelY != null) {
      return pixelY;
    }
  }

  getSVGObject(id: string): any {
    return this.idToSVGObject[id];
  }

  hasDataPointAtTimeZero(data: any[]): boolean {
    const firstDataPoint = data[0];
    if (firstDataPoint != null && firstDataPoint.t === 0) {
      return true;
    } else {
      return false;
    }
  }

  setPositionFromDataPoint(svgObject: any, dataPoint: any): void {
    let dataPointX = dataPoint.x;
    let dataPointY = dataPoint.y;
    if (dataPointX != null && dataPointX != '' && typeof dataPointX != 'undefined') {
      const dataPointXInPixels = this.dataXToPixelX(dataPointX);
      this.setXPositionOfSVGObject(svgObject, dataPointXInPixels);
    }

    if (dataPointY != null && dataPointY != '' && typeof dataPointY != 'undefined') {
      let dataPointYInPixels = this.dataYToPixelY(dataPointY);

      if (this.isUsingCartesianCoordinateSystem()) {
        dataPointYInPixels = this.convertToCartesianCoordinateSystem(dataPointYInPixels);
      }

      this.setYPositionOfSVGObject(svgObject, dataPointYInPixels);
    }
  }

  setPositionOfSVGObject(svgObject: any, x: number, y: number): void {
    svgObject.attr({ x: x, y: y });
  }

  setXPositionOfSVGObject(svgObject: any, x: number) {
    svgObject.attr('x', x);
  }

  setYPositionOfSVGObject(svgObject: any, y: number) {
    svgObject.attr('y', y);
  }

  startAnimation() {
    this.initializeObjectImages();
    this.initializeObjectPositions();
    for (const authoredObject of this.componentContent.objects) {
      this.animateObject(authoredObject);
    }
  }

  initializeObjectImages(): void {
    for (const object of this.componentContent.objects) {
      if (object.type === 'image') {
        const svgObject = this.idToSVGObject[object.id];
        svgObject.load(object.image);
      }
    }
  }

  initializeObjectPositions(): void {
    for (const object of this.componentContent.objects) {
      this.initializeObjectPosition(object);
    }
  }

  showTimeInSVG(time: number): void {
    if (this.timerText == null) {
      this.initializeTimerText();
    }

    this.setTimerText(time + '');
    const x = this.getTimerTextX(time);
    const y = 0;
    this.setTimerPosition(x, y);
  }

  initializeTimerText(): void {
    this.timerText = this.draw.text('0').attr({ fill: '#f03' });
  }

  /**
   * Get the x pixel coordinate based upon the number of digits of the time.
   * @param {number} time The time in seconds.
   * @returns {number} The x pixel coordinate.
   */
  getTimerTextX(time: number): number {
    const width = this.width;

    // set the x position near the top right of the svg div
    let x = width - 30;

    if (time >= 100) {
      // shift the text to the left if there are three digits
      x = width - 46;
    } else if (time >= 10) {
      // shift the text a little to the left if there are two digits
      x = width - 38;
    }
    return x;
  }

  setTimerText(text: string): void {
    this.timerText.text(text);
  }

  /**
   * @param {integer} x The x pixel coordinate.
   * @param {integer} y The y pixel coordinate.
   */
  setTimerPosition(x: number, y: number): void {
    this.timerText.attr({ x: x, y: y });
  }

  updateObjectDatasFromDataSources(): void {
    for (const object of this.componentContent.objects) {
      if (this.authoredObjectHasDataSource(object)) {
        this.updateObjectDataFromDataSource(object);
      }
    }
  }

  updateObjectDataFromDataSource(object: any): void {
    const dataSource = object.dataSource;
    const componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      dataSource.nodeId,
      dataSource.componentId
    );

    if (componentState != null) {
      if (componentState.componentType == 'Graph') {
        this.setDataFromGraphComponentState(object, componentState);
      } else if (componentState.componentType == 'Table') {
        this.setDataFromTableComponentState(object, componentState);
      }
    }
  }

  processConnectedComponentState(componentState: any): void {
    this.updateObjectDatasFromDataSourceComponentState(componentState);
  }

  updateObjectDatasFromDataSourceComponentState(componentState: any): void {
    for (const object of this.componentContent.objects) {
      if (
        this.authoredObjectHasDataSource(object) &&
        this.isComponentStateFromDataSource(componentState, object.dataSource)
      ) {
        this.updateObjectDataFromDataSourceComponentState(object, componentState);
      }
    }
  }

  isComponentStateFromDataSource(componentState: any, dataSource: any): boolean {
    if (
      dataSource != null &&
      dataSource.nodeId == componentState.nodeId &&
      dataSource.componentId == componentState.componentId
    ) {
      return true;
    } else {
      return false;
    }
  }

  updateObjectDataFromDataSourceComponentState(object: any, componentState: any): void {
    if (componentState.componentType === 'Graph') {
      this.setDataFromGraphComponentState(object, componentState);
    }
  }

  setDataFromGraphComponentState(object: any, componentState: any): void {
    object.data = this.getDataFromDataSourceComponentState(object.dataSource, componentState);
  }

  setDataFromTableComponentState(object: any, componentState: any): void {
    // TODO
  }

  getDataFromDataSourceComponentState(dataSource: any, componentState: any): any {
    const trialIndex = dataSource.trialIndex;
    const seriesIndex = dataSource.seriesIndex;
    const tColumnIndex = dataSource.tColumnIndex;
    const xColumnIndex = dataSource.xColumnIndex;
    const yColumnIndex = dataSource.yColumnIndex;
    const trial = this.getTrialFromComponentState(componentState, trialIndex);
    const singleSeries = this.getSeriesFromTrial(trial, seriesIndex);
    const seriesData = this.getDataFromSeries(singleSeries);
    return this.convertSeriesDataToAnimationData(
      seriesData,
      tColumnIndex,
      xColumnIndex,
      yColumnIndex
    );
  }

  getTrialFromComponentState(componentState: any, trialIndex: number): any {
    let trial = null;
    const studentData = componentState.studentData;
    if (studentData.trials != null) {
      trial = studentData.trials[trialIndex];
    }
    return trial;
  }

  getSeriesFromTrial(trial: any, seriesIndex: number): any {
    return trial.series[seriesIndex];
  }

  getDataFromSeries(series: any): any {
    return series.data;
  }

  convertSeriesDataToAnimationData(
    seriesData: any[],
    tColumnIndex: number,
    xColumnIndex: number,
    yColumnIndex: number
  ): any {
    const data = [];

    for (const seriesDataPoint of seriesData) {
      const animationDataPoint: any = {};

      if (tColumnIndex != null) {
        animationDataPoint.t = seriesDataPoint[tColumnIndex];
      }

      if (xColumnIndex != null) {
        animationDataPoint.x = seriesDataPoint[xColumnIndex];
      }

      if (yColumnIndex != null) {
        animationDataPoint.y = seriesDataPoint[yColumnIndex];
      }

      data.push(animationDataPoint);
    }
    return data;
  }

  animateObject(authoredObject: any): void {
    if (this.authoredObjectHasData(authoredObject)) {
      const id = authoredObject.id;
      const data = authoredObject.data;
      const svgObject = this.idToSVGObject[id];
      let animateObject = null;

      for (let d = 0; d < data.length; d++) {
        const currentDataPoint = data[d];
        const nextDataPoint = data[d + 1];
        const image = currentDataPoint.image;
        const t = currentDataPoint.t;
        const xPixel = this.dataXToPixelX(currentDataPoint.x);
        let yPixel = this.dataYToPixelY(currentDataPoint.y);
        if (this.isUsingCartesianCoordinateSystem()) {
          yPixel = this.convertToCartesianCoordinateSystem(yPixel);
        }
        this.idToWhetherAuthoredObjectIsAnimating[id] = true;

        if (this.isFirstDataPoint(d)) {
          animateObject = this.setInitialPositionOfSVGObject(t, svgObject, xPixel, yPixel);
        }

        animateObject = this.updateImageOfSVGObject(
          image,
          animateObject,
          svgObject,
          authoredObject,
          currentDataPoint,
          nextDataPoint
        );

        if (!this.isLastDataPoint(data, d)) {
          let nextT = null;
          let nextXPixel = null;
          let nextYPixel = null;

          if (nextDataPoint != null) {
            nextT = nextDataPoint.t;
            nextXPixel = this.dataXToPixelX(nextDataPoint.x);
            nextYPixel = this.dataYToPixelY(nextDataPoint.y);
          }
          if (this.isUsingCartesianCoordinateSystem()) {
            nextYPixel = this.convertToCartesianCoordinateSystem(nextYPixel);
          }

          const tDiff = this.calculateTimeDiff(t, nextT);
          animateObject = this.updatePositionOfSVGObject(
            svgObject,
            animateObject,
            t,
            tDiff,
            nextXPixel,
            nextYPixel
          );
        } else {
          this.animationCompletedPostProcessing(id, animateObject);
        }
      }
    }
  }

  setInitialPositionOfSVGObject(t: number, svgObject: any, xPixel: number, yPixel: number): any {
    let animateObject = null;
    if (t == 0) {
      svgObject.attr({ x: xPixel, y: yPixel });
    } else {
      // The first data point is not at time 0 so we will need to wait some time before we set the
      // position of the object.
      const thisAnimationController = this;
      animateObject = svgObject
        .animate(t * this.millisecondsPerDataTime)
        .during(function (pos, morph, eased, situation) {
          let totalElapsedTime = t * pos;
          thisAnimationController.displayAndBroadcastTime(totalElapsedTime);
        })
        .after(function () {
          this.attr({ x: xPixel, y: yPixel });
        });
    }
    return animateObject;
  }

  updatePositionOfSVGObject(
    svgObject: any,
    animateObject: any,
    t: number,
    tDiff: number,
    nextXPixel: number,
    nextYPixel: number
  ): any {
    // move the image to the next position in the given amount of time
    const thisAnimationController = this;
    return svgObject
      .animate(tDiff * this.millisecondsPerDataTime)
      .move(nextXPixel, nextYPixel)
      .during(function (pos, morph, eased, situation) {
        let totalElapsedTime = t + tDiff * pos;
        thisAnimationController.displayAndBroadcastTime(totalElapsedTime);
      });
  }

  animationCompletedPostProcessing(id: string, animateObject: any): void {
    animateObject.afterAll(() => {
      this.idToWhetherAuthoredObjectIsAnimating[id] = false;
      this.checkIfCanStop();
    });
  }

  updateImageOfSVGObject(
    image: string,
    animateObject: any,
    svgObject: any,
    authoredObject: any,
    currentDataPoint: any,
    nextDataPoint: any
  ): any {
    if (image != null && image !== '') {
      this.updateSVGObjectImage(image, svgObject, animateObject);
    } else if (nextDataPoint != null) {
      // There is a next data point so we will see if we can determine what image to show based upon
      // the movement of the object.
      const dynamicallyCalculatedImage = this.getImageBasedOnMovement(
        authoredObject,
        currentDataPoint,
        nextDataPoint
      );
      if (dynamicallyCalculatedImage != null) {
        this.updateSVGObjectImage(dynamicallyCalculatedImage, svgObject, animateObject);
      }
    }
    return animateObject;
  }

  updateSVGObjectImage(image: string, svgObject: any, animateObject: any): any {
    if (animateObject == null) {
      // change the image immediately
      svgObject.load(image);
    } else {
      // change the image after all the existing animations
      animateObject = animateObject.after(function () {
        this.load(image);
      });
    }
    return animateObject;
  }

  calculateTimeDiff(currentTime: number, futureTime: number): number {
    if (futureTime == null) {
      return 0;
    } else {
      return futureTime - currentTime;
    }
  }

  isFirstDataPoint(d: number): boolean {
    return d == 0;
  }

  isLastDataPoint(data: number[], d: number): boolean {
    return d == data.length - 1;
  }

  /**
   * @param {number} t The time in seconds.
   */
  displayAndBroadcastTime(t: number): void {
    const displayTime = this.truncateToOneDecimalPlace(t);
    this.showTimeInSVG(displayTime);

    if (this.isPerformBroadcast()) {
      this.broadcastTime(t);
    }

    if (this.lastBroadcastTime == null) {
      this.lastBroadcastTime = new Date().getTime();
    }
  }

  /**
   * @param {number} timeInSeconds
   */
  truncateToOneDecimalPlace(timeInSeconds: number): number {
    return Math.floor(timeInSeconds * 10) / 10;
  }

  /**
   * Check if we want to broadcast the time. We want to make sure we don't broadcast the time too
   * frequently because that may slow down the student's computer significantly. We will wait 100
   * milliseconds before each broadcast.
   * @returns {boolean}
   */
  isPerformBroadcast(): boolean {
    let currentTime = new Date().getTime();

    if (this.lastBroadcastTime == null || currentTime - this.lastBroadcastTime > 100) {
      return true;
    } else {
      return false;
    }
  }

  broadcastTime(t: number): void {
    const componentState = {
      t: t
    };

    this.StudentDataService.broadcastComponentStudentData({
      nodeId: this.nodeId,
      componentId: this.componentId,
      componentState: componentState
    });
    this.lastBroadcastTime = new Date().getTime();
  }

  /**
   * Get the image based upon the movement of the object.
   * @param {object} authoredObject The object that is being moved.
   * @param {object} currentDataPoint Contains x and y fields.
   * @param {object} extDataPoint Contains x and y fields.
   */
  getImageBasedOnMovement(authoredObject: any, currentDataPoint: any, nextDataPoint: any): string {
    if (this.isObjectMovingOnlyInXDirection(currentDataPoint, nextDataPoint)) {
      return this.getImageMovingInX(authoredObject, currentDataPoint, nextDataPoint);
    } else if (this.isObjectMovingOnlyInYDirection(currentDataPoint, nextDataPoint)) {
      return this.getImageMovingInY(authoredObject, currentDataPoint, nextDataPoint);
    }
    return null;
  }

  isObjectMovingOnlyInXDirection(currentDataPoint: any, nextDataPoint: any): boolean {
    return (
      this.isYDataPointSame(currentDataPoint, nextDataPoint) &&
      !this.isXDataPointSame(currentDataPoint, nextDataPoint)
    );
  }

  isObjectMovingOnlyInYDirection(currentDataPoint: any, nextDataPoint: any): boolean {
    return (
      this.isXDataPointSame(currentDataPoint, nextDataPoint) &&
      !this.isYDataPointSame(currentDataPoint, nextDataPoint)
    );
  }

  isXDataPointSame(currentDataPoint: any, nextDataPoint: any): boolean {
    return currentDataPoint.x == nextDataPoint.x;
  }

  isYDataPointSame(currentDataPoint: any, nextDataPoint: any): boolean {
    return currentDataPoint.y == nextDataPoint.y;
  }

  getImageMovingInX(authoredObject: any, currentDataPoint: any, nextDataPoint: any): string {
    if (this.isMovingRight(currentDataPoint, nextDataPoint)) {
      return this.getImageMovingRight(authoredObject);
    } else if (this.isMovingLeft(currentDataPoint, nextDataPoint)) {
      return this.getImageMovingLeft(authoredObject);
    }
    return null;
  }

  getImageMovingInY(authoredObject: any, currentDataPoint: any, nextDataPoint: any): string {
    if (this.isYIncreasing(currentDataPoint, nextDataPoint)) {
      return this.getImageYIncreasing(authoredObject);
    } else if (this.isYDecreasing(currentDataPoint, nextDataPoint)) {
      return this.getImageYDecreasing(authoredObject);
    }
    return null;
  }

  isMovingRight(currentDataPoint: any, nextDataPoint: any): boolean {
    return this.isFieldIncreasing(currentDataPoint, nextDataPoint, 'x');
  }

  isMovingLeft(currentDataPoint: any, nextDataPoint: any): boolean {
    return this.isFieldDecreasing(currentDataPoint, nextDataPoint, 'x');
  }

  isYIncreasing(currentDataPoint: any, nextDataPoint: any): boolean {
    return this.isFieldIncreasing(currentDataPoint, nextDataPoint, 'y');
  }

  isYDecreasing(currentDataPoint: any, nextDataPoint: any): boolean {
    return this.isFieldDecreasing(currentDataPoint, nextDataPoint, 'y');
  }

  isFieldIncreasing(currentDataPoint: any, nextDataPoint: any, fieldName: string): boolean {
    return currentDataPoint[fieldName] < nextDataPoint[fieldName];
  }

  isFieldDecreasing(currentDataPoint: any, nextDataPoint: any, fieldName: string): boolean {
    return currentDataPoint[fieldName] > nextDataPoint[fieldName];
  }

  getImageYIncreasing(authoredObject: any): any {
    if (this.isUsingCartesianCoordinateSystem()) {
      return this.getImageMovingUp(authoredObject);
    } else {
      return this.getImageMovingDown(authoredObject);
    }
  }

  getImageYDecreasing(authoredObject: any): any {
    if (this.isUsingCartesianCoordinateSystem()) {
      return this.getImageMovingDown(authoredObject);
    } else {
      return this.getImageMovingUp(authoredObject);
    }
  }

  getImageMovingUp(authoredObject: any): string {
    if (authoredObject.imageMovingUp != null && authoredObject.imageMovingUp != '') {
      return authoredObject.imageMovingUp;
    } else {
      return null;
    }
  }

  getImageMovingDown(authoredObject: any): string {
    if (authoredObject.imageMovingDown != null && authoredObject.imageMovingDown != '') {
      return authoredObject.imageMovingDown;
    } else {
      return null;
    }
  }

  getImageMovingLeft(authoredObject: any): string {
    if (authoredObject.imageMovingLeft != null && authoredObject.imageMovingLeft != '') {
      return authoredObject.imageMovingLeft;
    } else {
      return null;
    }
  }

  getImageMovingRight(authoredObject: any): string {
    if (authoredObject.imageMovingRight != null && authoredObject.imageMovingRight != '') {
      return authoredObject.imageMovingRight;
    } else {
      return null;
    }
  }

  checkIfCanStop(): void {
    if (!this.areAnyObjectsAnimating()) {
      this.setAnimationStateToStopped();
    }
  }

  areAnyObjectsAnimating(): boolean {
    for (const object of this.componentContent.objects) {
      if (this.idToWhetherAuthoredObjectIsAnimating[object.id]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Populate the student work into the component.
   * @param {object} componentState The component state to populate into the component.
   */
  setStudentWork(componentState: any): void {
    this.submitCounter = componentState.studentData.submitCounter;
    if (componentState.studentData.numTimesPlayClicked != null) {
      this.numTimesPlayClicked = componentState.studentData.numTimesPlayClicked;
    }
    this.processLatestStudentWork();
  }

  confirmSubmit(numberOfSubmitsLeft: number): boolean {
    let isPerformSubmit = false;
    if (numberOfSubmitsLeft <= 0) {
      alert($localize`You do not have any more chances to receive feedback on your answer.`);
    } else if (numberOfSubmitsLeft == 1) {
      isPerformSubmit = confirm(
        $localize`You have 1 chance to receive feedback on your answer so this this should be your best work.\n\nAre you ready to receive feedback on this answer?`
      );
    } else if (numberOfSubmitsLeft > 1) {
      isPerformSubmit = confirm(
        $localize`You have ${numberOfSubmitsLeft} chances to receive feedback on your answer so this this should be your best work.\n\nAre you ready to receive feedback on this answer?`
      );
    }
    return isPerformSubmit;
  }

  studentDataChanged(): void {
    this.setIsDirty(true);
    this.emitComponentDirty(true);
    this.setIsSubmitDirty(true);
    this.emitComponentSubmitDirty(true);
    this.clearLatestComponentState();
    this.createComponentStateAndBroadcast('change');
  }

  /**
   * Create a new component state populated with the student data.
   * @param {string} action The action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'.
   * @return {promise} A promise that will return a component state.
   */
  createComponentState(action: string): Promise<any> {
    const componentState = this.createComponentStateObject();
    this.setIsSubmit(false);
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
      this.isSubmitButtonDisabled = true;
    }
    componentState.componentType = 'Animation';
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  createComponentStateObject(): any {
    const componentState: any = this.createNewComponentState();
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    const studentData = {
      numTimesPlayClicked: this.numTimesPlayClicked,
      submitCounter: this.submitCounter
    };
    componentState.studentData = studentData;
    componentState.isSubmit = this.isSubmit;
    if (this.isSubmit && this.hasDefaultFeedback()) {
      this.addDefaultFeedback(componentState);
    }
    return componentState;
  }

  /**
   * @param {object} data The annotation data.
   * @returns {object} The auto score annotation.
   */
  createAutoScoreAnnotation(data: any): any {
    const runId = this.ConfigService.getRunId();
    const periodId = this.ConfigService.getPeriodId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const toWorkgroupId = this.ConfigService.getWorkgroupId();
    return this.AnnotationService.createAutoScoreAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      toWorkgroupId,
      data
    );
  }

  /**
   * @param {object} data The annotation data.
   * @returns {object} The auto comment annotation.
   */
  createAutoCommentAnnotation(data: any): any {
    const runId = this.ConfigService.getRunId();
    const periodId = this.ConfigService.getPeriodId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const toWorkgroupId = this.ConfigService.getWorkgroupId();
    return this.AnnotationService.createAutoCommentAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      toWorkgroupId,
      data
    );
  }

  playButtonClicked(): void {
    this.incrementNumTimesPlayClicked();
    this.setAnimationStateToPlaying();
    this.startAnimation();
    this.studentDataChanged();
  }

  incrementNumTimesPlayClicked(): void {
    this.numTimesPlayClicked++;
  }

  pauseButtonClicked(): void {
    this.setAnimationStateToPaused();
    for (const object of this.componentContent.objects) {
      const svgObject = this.idToSVGObject[object.id];
      svgObject.pause();
    }
  }

  resumeButtonClicked(): void {
    this.setAnimationStateToPlaying();
    for (const object of this.componentContent.objects) {
      const id = object.id;
      const svgObject = this.idToSVGObject[id];
      // Check if the object still needs to be animated or if it has already finished performing all
      // of its animation. We only need to play it if it still has more animating.
      if (this.idToWhetherAuthoredObjectIsAnimating[id]) {
        svgObject.play();
      }
    }
  }

  resetButtonClicked(): void {
    this.setAnimationStateToStopped();

    for (const object of this.componentContent.objects) {
      const id = object.id;
      const svgObject = this.idToSVGObject[id];
      // Check if the object still needs to be animated or if it has already finished performing all
      // of its animation. We only need to play it if it still has more animating.
      if (this.idToWhetherAuthoredObjectIsAnimating[id]) {
        // We need to play it in case it is currently paused. There is a minor bug in the animation
        // library which is caused if you pause an animation and then stop the animation. Then if
        // you try to play the animation, the animation will not play. We avoid this problem by
        // making sure the object animation is playing when we stop it.
        svgObject.play();
      }

      const jumpToEnd = true;
      const clearQueue = true;

      // stop the object from animating
      svgObject.stop(jumpToEnd, clearQueue);
    }

    setTimeout(() => {
      this.displayAndBroadcastTime(0);
      this.initializeObjectImages();
      this.initializeObjectPositions();
    }, 100);
  }

  isUsingCartesianCoordinateSystem(): boolean {
    return this.coordinateSystem == 'cartesian';
  }

  /**
   * Convert the y value to the cartesian coordinate system
   * @param {integer} y the pixel y value in the screen coordinate system
   * @return {integer} the pixel y value in the cartesian coordinate system
   */
  convertToCartesianCoordinateSystem(y: number): number {
    return this.height - y;
  }

  speedSliderChanged(speedValue: number): void {
    this.setSpeed(speedValue);
    this.resetButtonClicked();
  }

  setSpeed(speedSliderValue: number): void {
    this.millisecondsPerDataTime = this.speedToMillisecondsPerDataTime[speedSliderValue];
  }

  authoredObjectHasData(authoredObject: any): boolean {
    return authoredObject.data != null && authoredObject.data.length > 0;
  }

  authoredObjectHasDataSource(authoredObject: any): boolean {
    return authoredObject.dataSource != null;
  }
}
