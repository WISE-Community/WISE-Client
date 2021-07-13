import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { AudioOscillatorService } from '../audioOscillatorService';

@Component({
  selector: 'audio-oscillator-student',
  templateUrl: 'audio-oscillator-student.component.html',
  styleUrls: ['audio-oscillator-student.component.scss']
})
export class AudioOscillatorStudent extends ComponentStudent {
  analyser: any;
  audioContext: any;
  destination: any;
  frequenciesPlayed: number[] = [];
  frequenciesPlayedSorted: number[] = [];
  frequency: number = 440;
  gain: any;
  goodDraw: boolean;
  gridCellSize: number = 50;
  isPlaying: boolean = false;
  maxFrequencyPlayed: number;
  minFrequencyPlayed: number;
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
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    private AudioOscillatorService: AudioOscillatorService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
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
    this.oscilloscopeId = 'oscilloscope' + this.componentId;
    this.setButtonTextToPlay();
    this.setParametersFromComponentContent();

    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (
      this.AudioOscillatorService.componentStateHasStudentWork(
        this.componentState,
        this.componentContent
      )
    ) {
      this.setStudentWork(this.componentState);
    } else if (this.UtilService.hasConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    }

    if (this.hasMaxSubmitCount() && !this.hasSubmitsLeft()) {
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
  }

  setFieldMininum1(field: string, value: number): void {
    this[field] = value < 1 ? 1 : value;
  }

  setStudentWork(componentState: any): void {
    const studentData = componentState.studentData;
    this.frequenciesPlayed = studentData.frequenciesPlayed;
    if (this.frequenciesPlayed.length > 0) {
      this.frequency = this.frequenciesPlayed[this.frequenciesPlayed.length - 1];
    }
    this.frequenciesPlayedSorted = studentData.frequenciesPlayedSorted;
    this.numberOfFrequenciesPlayed = studentData.numberOfFrequenciesPlayed;
    this.minFrequencyPlayed = studentData.minFrequencyPlayed;
    this.maxFrequencyPlayed = studentData.maxFrequencyPlayed;
    this.submitCounter = studentData.submitCounter;
    this.attachments = studentData.attachments;
    this.processLatestStudentWork();
  }

  createComponentState(action: string): Promise<any> {
    const componentState: any = this.NodeService.createNewComponentState();
    componentState.isSubmit = this.isSubmit;
    componentState.componentType = 'AudioOscillator';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    componentState.studentData = this.createStudentData(
      this.frequenciesPlayed,
      this.frequenciesPlayedSorted,
      this.numberOfFrequenciesPlayed,
      this.minFrequencyPlayed,
      this.maxFrequencyPlayed,
      this.submitCounter
    );
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
    frequenciesPlayed: number[] = [],
    frequenciesPlayedSorted: number[] = [],
    numberOfFrequenciesPlayed: number = 0,
    minFrequencyPlayed: number = null,
    maxFrequencyPlayed: number = null,
    submitCounter: number = 0
  ): any {
    return {
      frequenciesPlayed: frequenciesPlayed,
      frequenciesPlayedSorted: frequenciesPlayedSorted,
      numberOfFrequenciesPlayed: numberOfFrequenciesPlayed,
      minFrequencyPlayed: minFrequencyPlayed,
      maxFrequencyPlayed: maxFrequencyPlayed,
      submitCounter: submitCounter
    };
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
    this.gain.gain.value = 0.5;
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
    this.studentDataChanged();
  }

  addFrequencyPlayed(frequency: number): void {
    this.frequenciesPlayed.push(frequency);
    this.frequenciesPlayedSorted = this.UtilService.makeCopyOfJSONObject(this.frequenciesPlayed);
    this.frequenciesPlayedSorted.sort((a, b) => a - b);
    this.numberOfFrequenciesPlayed = this.frequenciesPlayed.length;
    this.minFrequencyPlayed = Math.min(...this.frequenciesPlayed);
    this.maxFrequencyPlayed = Math.max(...this.frequenciesPlayed);
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
    const mergedComponentState: any = this.NodeService.createNewComponentState();
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
    this.mergeFrequenciesPlayedSorted(existingStudentData, newStudentData);
    this.mergeNumberOfFrequenciesPlayed(existingStudentData, newStudentData);
    this.mergeMinFrequencyPlayed(existingStudentData, newStudentData);
    this.mergeMaxFrequencyPlayed(existingStudentData, newStudentData);
    return existingStudentData;
  }

  mergeFrequenciesPlayed(existingStudentData: any, newStudentData: any): void {
    existingStudentData.frequenciesPlayed = existingStudentData.frequenciesPlayed.concat(
      newStudentData.frequenciesPlayed
    );
  }

  mergeFrequenciesPlayedSorted(existingStudentData: any, newStudentData: any): void {
    const frequenciesPlayedSorted = this.UtilService.makeCopyOfJSONObject(
      existingStudentData.frequenciesPlayedSorted.concat(newStudentData.frequenciesPlayedSorted)
    );
    frequenciesPlayedSorted.sort();
    existingStudentData.frequenciesPlayedSorted = frequenciesPlayedSorted;
  }

  mergeNumberOfFrequenciesPlayed(existingStudentData: any, newStudentData: any): void {
    existingStudentData.numberOfFrequenciesPlayed =
      existingStudentData.numberOfFrequenciesPlayed + newStudentData.numberOfFrequenciesPlayed;
  }

  mergeMinFrequencyPlayed(existingStudentData: any, newStudentData: any): void {
    if (existingStudentData.minFrequencyPlayed == null) {
      existingStudentData.minFrequencyPlayed = newStudentData.minFrequencyPlayed;
    } else {
      existingStudentData.minFrequencyPlayed = Math.min(
        existingStudentData.minFrequencyPlayed,
        newStudentData.minFrequencyPlayed
      );
    }
  }

  mergeMaxFrequencyPlayed(existingStudentData: any, newStudentData: any): void {
    if (existingStudentData.maxFrequencyPlayed == null) {
      existingStudentData.maxFrequencyPlayed = newStudentData.maxFrequencyPlayed;
    } else {
      existingStudentData.maxFrequencyPlayed = Math.max(
        existingStudentData.maxFrequencyPlayed,
        newStudentData.maxFrequencyPlayed
      );
    }
  }
}
