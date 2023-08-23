import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { copy } from '../../../common/object/object';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { AudioOscillatorService } from '../audioOscillatorService';
import { hasConnectedComponent } from '../../../common/ComponentContent';

@Component({
  selector: 'audio-oscillator-student',
  templateUrl: 'audio-oscillator-student.component.html',
  styleUrls: ['audio-oscillator-student.component.scss']
})
export class AudioOscillatorStudent extends ComponentStudent {
  amplitude: number;
  amplitudesPlayed: number[] = [];
  amplitudesPlayedSorted: number[] = [];
  analyser: any;
  audioContext: any;
  canStudentEditAmplitude: boolean = true;
  canStudentEditFrequency: boolean = true;
  canStudentViewAmplitudeInput: boolean = true;
  canStudentViewFrequencyInput: boolean = true;
  defaultDBSPL: number = 44;
  destination: any;
  frequenciesPlayed: number[] = [];
  frequenciesPlayedSorted: number[] = [];
  frequency: number = 440;
  gain: any;
  goodDraw: boolean;
  gridCellSize: number = 50;
  isPlaying: boolean = false;
  maxAmplitude: number;
  maxAmplitudePlayed: number;
  maxFrequencyPlayed: number;
  // We have strategically chosen the max dBSPL to be 50 so that when the student lowers the
  // amplitude to 0 it coincides with the sound curve being completely flat and no more sound being
  // emitted. If we chose a value much higher, the student could lower the amplitude to something
  // low like 20 and no longer see a curve in the sound wave and no longer hear the sound even when
  // they should still be able to see and hear 20 dBSPL. If we chose a value much lower, the student
  // could set the amplitude to 0 but still see a curve in the sound wave and also still hear the
  // sound when they should not be able to see or hear anything.
  maxDBSPL: number = this.AudioOscillatorService.maxAmplitude;
  minAmplitude: number;
  minAmplitudePlayed: number;
  minDBSPL: number = 0;
  minFrequencyPlayed: number;
  numberOfAmplitudesPlayed: number = 0;
  numberOfFrequenciesPlayed: number = 0;
  oscillator: any;
  oscillatorType: string = 'sine';
  oscillatorTypes: string[] = [];
  oscilloscopeHeight: number = 400;
  oscilloscopeId: string;
  oscilloscopeWidth: number = 800;
  playStopButtonText: string;
  stopAfterGoodDraw: boolean = true;

  constructor(
    protected AnnotationService: AnnotationService,
    private AudioOscillatorService: AudioOscillatorService,
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
    const domIdEnding = this.AudioOscillatorService.getDomIdEnding(
      this.nodeId,
      this.componentId,
      this.componentState
    );
    this.oscilloscopeId = this.AudioOscillatorService.getOscilloscopeId(domIdEnding);
    this.setButtonTextToPlay();
    this.setParametersFromComponentContent();

    if (hasConnectedComponent(this.componentContent, 'showWork')) {
      this.handleConnectedComponents();
    } else if (
      this.AudioOscillatorService.componentStateHasStudentWork(
        this.componentState,
        this.componentContent
      )
    ) {
      this.setStudentWork(this.componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
    }

    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableSubmitButton();
    }

    this.disableComponentIfNecessary();
    this.initializeAudioContext();
    this.broadcastDoneRenderingComponent();
  }

  ngAfterViewInit(): void {
    this.drawOscilloscopeGrid();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.stop();
    this.audioContext.close();
  }

  initializeAudioContext(): void {
    this.audioContext = new AudioContext();
  }

  setParametersFromComponentContent(): void {
    this.frequency = this.componentContent.startingFrequency;
    this.oscillatorTypes = this.componentContent.oscillatorTypes;
    if (this.componentContent.oscillatorTypes.length > 0) {
      this.oscillatorType = this.componentContent.oscillatorTypes[0];
    }
    this.setFieldMininum1('oscilloscopeWidth', this.componentContent.oscilloscopeWidth);
    this.setFieldMininum1('oscilloscopeHeight', this.componentContent.oscilloscopeHeight);
    this.setFieldMininum1('gridCellSize', this.componentContent.gridCellSize);
    this.stopAfterGoodDraw = this.componentContent.stopAfterGoodDraw;
    this.setMinMaxAmplitude();
    this.setAmplitude(this.componentContent.startingAmplitude);
    this.setCanStudentEditAmplitude(this.componentContent.canStudentEditAmplitude);
    this.setCanStudentViewAmplitudeInput(this.componentContent.canStudentViewAmplitudeInput);
    this.setCanStudentEditFrequency(this.componentContent.canStudentEditFrequency);
    this.setCanStudentViewFrequencyInput(this.componentContent.canStudentViewFrequencyInput);
  }

  setFieldMininum1(field: string, value: number): void {
    this[field] = value < 1 ? 1 : value;
  }

  setMinMaxAmplitude(): void {
    this.maxAmplitude = this.maxDBSPL;
    this.minAmplitude = this.minDBSPL;
  }

  setAmplitude(amplitude: number): void {
    if (amplitude == null) {
      this.amplitude = this.defaultDBSPL;
    } else {
      this.amplitude = amplitude;
    }
  }

  setCanStudentEditAmplitude(canStudentEditAmplitude: boolean = true): void {
    this.canStudentEditAmplitude = canStudentEditAmplitude;
  }

  setCanStudentEditFrequency(canStudentEditFrequency: boolean = true): void {
    this.canStudentEditFrequency = canStudentEditFrequency;
  }

  setCanStudentViewAmplitudeInput(canStudentViewAmplitudeInput: boolean = true): void {
    this.canStudentViewAmplitudeInput = canStudentViewAmplitudeInput;
  }

  setCanStudentViewFrequencyInput(canStudentViewFrequencyInput: boolean = true): void {
    this.canStudentViewFrequencyInput = canStudentViewFrequencyInput;
  }

  setStudentWork(componentState: any): void {
    const studentData = componentState.studentData;
    this.setFrequencyStudentWork(studentData);
    if (this.isAmplitudeInStudentWork(studentData)) {
      this.setAmplitudeStudentWork(studentData);
    }
    this.submitCounter = studentData.submitCounter;
    this.attachments = studentData.attachments;
    this.processLatestStudentWork();
  }

  setFrequencyStudentWork(studentData: any): void {
    this.frequenciesPlayed = studentData.frequenciesPlayed;
    if (this.frequenciesPlayed.length > 0) {
      this.frequency = this.frequenciesPlayed[this.frequenciesPlayed.length - 1];
    }
  }

  isAmplitudeInStudentWork(studentData: any): boolean {
    return studentData.amplitudesPlayed != null;
  }

  setAmplitudeStudentWork(studentData: any): void {
    this.amplitudesPlayed = studentData.amplitudesPlayed;
    if (this.amplitudesPlayed.length > 0) {
      this.amplitude = this.amplitudesPlayed[this.amplitudesPlayed.length - 1];
    }
  }

  createComponentState(action: string): Promise<any> {
    const componentState: any = this.createNewComponentState();
    componentState.isSubmit = this.isSubmit;
    componentState.componentType = 'AudioOscillator';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    const studentData = {
      submitCounter: this.submitCounter
    };
    this.addFrequencyDataToStudentData(studentData);
    this.addAmplitudeDataToStudentData(studentData);
    componentState.studentData = studentData;
    if (this.isSubmit && this.hasDefaultFeedback()) {
      this.addDefaultFeedback(componentState);
    }
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  createStudentData(
    amplitudesPlayed: number[] = [],
    frequenciesPlayed: number[] = [],
    submitCounter: number = 0
  ): any {
    return {
      amplitudesPlayed: amplitudesPlayed,
      frequenciesPlayed: frequenciesPlayed,
      submitCounter: submitCounter
    };
  }

  addFrequencyDataToStudentData(studentData: any): void {
    studentData.frequenciesPlayed = this.frequenciesPlayed;
    studentData.frequenciesPlayedSorted = copy(this.frequenciesPlayed).sort();
    studentData.numberOfFrequenciesPlayed = this.frequenciesPlayed.length;
    studentData.numberOfUniqueFrequenciesPlayed = [...new Set(this.frequenciesPlayed)].length;
    studentData.minFrequencyPlayed = Math.min(...this.frequenciesPlayed);
    studentData.maxFrequencyPlayed = Math.max(...this.frequenciesPlayed);
  }

  addAmplitudeDataToStudentData(studentData: any): void {
    studentData.amplitudesPlayed = this.amplitudesPlayed;
    studentData.amplitudesPlayedSorted = copy(this.amplitudesPlayed).sort();
    studentData.numberOfAmplitudesPlayed = this.amplitudesPlayed.length;
    studentData.numberOfUniqueAmplitudesPlayed = [...new Set(this.amplitudesPlayed)].length;
    studentData.minAmplitudePlayed = Math.min(...this.amplitudesPlayed);
    studentData.maxAmplitudePlayed = Math.max(...this.amplitudesPlayed);
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.stop();
      this.setButtonTextToPlay();
    } else {
      this.play();
      this.setButtonTextToStop();
    }
  }

  setButtonTextToPlay(): void {
    this.playStopButtonText = $localize`Play`;
  }

  setButtonTextToStop(): void {
    this.playStopButtonText = $localize`Stop`;
  }

  play(): void {
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = this.oscillatorType;
    this.oscillator.frequency.value = this.frequency;
    this.gain = this.audioContext.createGain();
    this.gain.gain.value = this.getGain(this.amplitude);
    this.destination = this.audioContext.destination;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.oscillator.connect(this.gain);
    this.gain.connect(this.destination);
    this.gain.connect(this.analyser);
    this.oscillator.start();
    this.goodDraw = false;
    this.isPlaying = true;
    this.drawOscilloscope();
    this.addFrequencyPlayed(this.frequency);
    this.addAmplitudePlayed(this.amplitude);
    this.studentDataChanged();
  }

  getGain(dbspl: number): number {
    const dbfs = this.convertDBSPLToDBFS(dbspl);
    return this.convertDBFSToGainValue(dbfs);
  }

  /**
   * There is no actual decibel FS (dBFS) to decibel SPL (dBSPL) conversion because it does not
   * exist.
   * - dBFS is a computer signal measurement that ranges from negative infinity to 0, where 0 is the
   * loudest the computer can output.
   * - dBSPL is a sound pressure measurement that ranges from 0 to 194, where 194 is the loudest
   * possible sound in air.
   * We will use a conversion function that will do its best to convert from dBFS to dBSPL in our
   * context to get the basic idea across.
   */
  convertDBSPLToDBFS(dbspl: number): number {
    // Since we need a number that is negative or 0, we will take the dBSPL the student has chosen
    // and subtract the max dBSPL that we allow. This means the higher the dBSPL the student chose,
    // the closer the dBFS will be to 0 and therefore louder. The lower the dBSPL the student
    // chose, the more negative the dBFS will be and therefore quieter.
    return dbspl - this.maxDBSPL;
  }

  /**
   * The decibel FS to gain conversion function was obtained from
   * https://www.w3.org/TR/webaudio/#linear-to-decibel
   */
  convertDBFSToGainValue(dbfs: number): number {
    return Math.pow(10, dbfs / 20);
  }

  amplitudeChanged(): void {
    this.amplitude = this.limitAmplitudeIfNecessary(this.amplitude);
    this.refreshOscilloscope();
  }

  amplitudeKeyUp(event: any): void {
    if (this.isNumberEvent(event)) {
      this.amplitudeChanged();
    }
  }

  isNumberEvent(event: any): boolean {
    const keyCode = event.keyCode;
    return this.isTopRowNumber(keyCode) || this.isNumPadNumber(keyCode);
  }

  isTopRowNumber(keyCode: number): boolean {
    return 48 <= keyCode && keyCode <= 57;
  }

  isNumPadNumber(keyCode: number): boolean {
    return 96 <= keyCode && keyCode <= 105;
  }

  limitAmplitudeIfNecessary(amplitude: number): number {
    if (amplitude > this.maxAmplitude) {
      return this.maxAmplitude;
    } else if (amplitude < this.minAmplitude) {
      return this.minAmplitude;
    }
    return amplitude;
  }

  addFrequencyPlayed(frequency: number): void {
    this.frequenciesPlayed.push(frequency);
  }

  addAmplitudePlayed(amplitude: number): void {
    this.amplitudesPlayed.push(amplitude);
  }

  stop(): void {
    if (this.oscillator != null) {
      this.oscillator.stop();
    }
    this.isPlaying = false;
  }

  drawOscilloscope(): void {
    if (!this.isPlaying) {
      return;
    }

    this.drawOscilloscopeGrid();
    this.startDrawingAudioSignalLine();
    const firstRisingZeroCrossingIndex = this.drawOscilloscopePoints();

    if (this.isFirstRisingZeroCrossingIndexCloseToZero(firstRisingZeroCrossingIndex)) {
      /*
       * we want the first rising zero crossing index to be close to zero so that the graph spans
       * almost the whole width of the canvas. if the first rising zero crossing index was close to
       * bufferLength size then we would see a cut off graph.
       */
      this.goodDraw = true;
    }

    if (this.isDrawAgain()) {
      requestAnimationFrame(() => {
        this.drawOscilloscope();
      });
    }
  }

  getTimeData(): any {
    const bufferLength = this.analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(timeData);
    return timeData;
  }

  startDrawingAudioSignalLine(): void {
    const ctx = (<HTMLCanvasElement>document.getElementById(this.oscilloscopeId)).getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0, 200, 0)';
    ctx.beginPath();
  }

  getSliceWidth(): number {
    const ctx = (<HTMLCanvasElement>document.getElementById(this.oscilloscopeId)).getContext('2d');
    const bufferLength = this.analyser.frequencyBinCount;
    const width = ctx.canvas.width;
    return (width * 1.0) / bufferLength;
  }

  drawOscilloscopePoints(): number {
    const ctx = (<HTMLCanvasElement>document.getElementById(this.oscilloscopeId)).getContext('2d');
    const height = ctx.canvas.height;
    const timeData = this.getTimeData();
    const sliceWidth = this.getSliceWidth();
    let x = 0;
    let v = 0;
    let y = 0;

    /*
     * we want to start drawing the audio signal such that the first point is at 0,0 on the
     * oscilloscope and the signal rises after that.
     * e.g. pretend the ascii below is a sine wave
     *  _       _
     * / \     / \
     * -------------------
     *     \_/     \_/
     */
    let foundFirstRisingZeroCrossing = false;
    let firstRisingZeroCrossingIndex = null;
    let isFirstPointDrawn = false;

    /*
     * loop through all the points and draw the signal from the first rising zero crossing to the
     * end of the buffer
     */
    for (let i = 0; i < timeData.length; i++) {
      const currentY = timeData[i] - 128;
      const nextY = timeData[i + 1] - 128;

      if (this.isFirstRisingZeroCrossingPoint(foundFirstRisingZeroCrossing, currentY, nextY)) {
        foundFirstRisingZeroCrossing = true;
        firstRisingZeroCrossingIndex = i;
      }

      if (foundFirstRisingZeroCrossing) {
        /*
         * get the height of the point. we need to perform this subtraction of 128 to flip the value
         * since canvas positioning is relative to the upper left corner being 0,0.
         */
        v = (128 - (timeData[i] - 128)) / 128.0;
        y = (v * height) / 2;
        this.drawPoint(ctx, isFirstPointDrawn, x, y);
        if (!isFirstPointDrawn) {
          isFirstPointDrawn = true;
        }
        x += sliceWidth;
      }
    }

    ctx.stroke();

    return firstRisingZeroCrossingIndex;
  }

  isFirstRisingZeroCrossingPoint(
    foundFirstRisingZeroCrossing: boolean,
    currentY: number,
    nextY: number
  ): boolean {
    return !foundFirstRisingZeroCrossing && (currentY < 0 || currentY == 0) && nextY > 0;
  }

  drawPoint(ctx: any, isFirstPointDrawn: boolean, x: number, y: number): void {
    if (isFirstPointDrawn) {
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
    }
  }

  isFirstRisingZeroCrossingIndexCloseToZero(firstRisingZeroCrossingIndex: number): boolean {
    return firstRisingZeroCrossingIndex > 0 && firstRisingZeroCrossingIndex < 10;
  }

  isDrawAgain(): boolean {
    return !this.stopAfterGoodDraw || !this.goodDraw;
  }

  drawOscilloscopeGrid(): void {
    const ctx = (<HTMLCanvasElement>document.getElementById(this.oscilloscopeId)).getContext('2d');
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const gridCellSize = this.gridCellSize;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'lightgrey';
    ctx.beginPath();
    this.drawVerticalLines(ctx, width, height, gridCellSize);
    this.drawHorizontalLines(ctx, width, height, gridCellSize);
    ctx.stroke();
  }

  drawVerticalLines(ctx: any, width: number, height: number, gridCellSize: number): void {
    let x = 0;
    while (x < width) {
      this.drawVerticalLine(ctx, x, height);
      x += gridCellSize;
    }
  }

  drawVerticalLine(ctx: any, x: number, height: number): void {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  drawHorizontalLines(ctx: any, width: number, height: number, gridCellSize: number): void {
    this.drawHorizontalLinesAboveMiddle(ctx, width, height, gridCellSize);
    this.drawHorizontalLinesBelowMiddle(ctx, width, height, gridCellSize);
  }

  drawHorizontalLinesAboveMiddle(
    ctx: any,
    width: number,
    height: number,
    gridCellSize: number
  ): void {
    let y = height / 2;
    while (y >= 0) {
      this.drawHorizontalLine(ctx, y, width);
      y -= gridCellSize;
    }
  }

  drawHorizontalLinesBelowMiddle(
    ctx: any,
    width: number,
    height: number,
    gridCellSize: number
  ): void {
    let y = height / 2;
    while (y < height) {
      this.drawHorizontalLine(ctx, y, width);
      y += gridCellSize;
    }
  }

  drawHorizontalLine(ctx: any, y: number, width: number): void {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  refreshOscilloscope(): void {
    this.drawOscilloscopeGrid();
    if (this.isPlaying) {
      this.restartPlayer();
    }
  }

  restartPlayer(): void {
    this.stop();
    this.play();
  }

  /**
   * Create a component state with the merged student responses.
   * @param componentStates An array of component states.
   * @return A component state with the merged student responses.
   */
  createMergedComponentState(componentStates: any[]): any {
    const mergedStudentData = this.createStudentData();
    for (const componentState of componentStates) {
      this.mergeStudentData(mergedStudentData, componentState.studentData);
    }
    const mergedComponentState: any = this.createNewComponentState();
    mergedComponentState.studentData = mergedStudentData;
    return mergedComponentState;
  }

  /**
   * Merge the values in the student data.
   * @param existingStudentData The old student data we will merge into.
   * @param newStudentData The new student data we will merge.
   * @return The merged student data.
   */
  mergeStudentData(existingStudentData: any, newStudentData: any): any {
    this.mergeFrequenciesPlayed(existingStudentData, newStudentData);
    this.mergeAmplitudesPlayed(existingStudentData, newStudentData);
    return existingStudentData;
  }

  mergeFrequenciesPlayed(existingStudentData: any, newStudentData: any): void {
    existingStudentData.frequenciesPlayed = existingStudentData.frequenciesPlayed.concat(
      newStudentData.frequenciesPlayed
    );
  }

  mergeAmplitudesPlayed(existingStudentData: any, newStudentData: any): void {
    existingStudentData.amplitudesPlayed = existingStudentData.amplitudesPlayed.concat(
      newStudentData.amplitudesPlayed
    );
  }
}
