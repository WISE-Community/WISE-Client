import { ComponentService } from '../componentService';
import { Injectable } from '@angular/core';
import { StudentDataService } from '../../services/studentDataService';
import { UtilService } from '../../services/utilService';

@Injectable()
export class AudioOscillatorService extends ComponentService {
  defaultStartingAmplitude: number = 44;
  defaultStartingFrequency: number = 440;
  maxAmplitude: number = 50;

  constructor(
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(StudentDataService, UtilService);
  }

  getComponentTypeLabel(): string {
    return $localize`Audio Oscillator`;
  }

  createComponent() {
    const component: any = super.createComponent();
    component.type = 'AudioOscillator';
    component.oscillatorTypes = ['sine'];
    component.startingAmplitude = this.defaultStartingAmplitude;
    component.startingFrequency = this.defaultStartingFrequency;
    component.oscilloscopeWidth = 800;
    component.oscilloscopeHeight = 400;
    component.gridCellSize = 50;
    component.stopAfterGoodDraw = true;
    component.canStudentEditAmplitude = true;
    component.canStudentEditFrequency = true;
    component.canStudentViewAmplitudeInput = true;
    component.canStudentViewFrequencyInput = true;
    return component;
  }

  isCompleted(
    component: any,
    componentStates: any[],
    componentEvents: any[],
    nodeEvents: any[],
    node: any
  ) {
    if (componentStates && componentStates.length) {
      const latestComponentState = componentStates[componentStates.length - 1];
      return this.componentStateHasStudentWork(latestComponentState, component);
    }
    return false;
  }

  componentStateHasStudentWork(componentState: any, componentContent: any) {
    if (componentState != null) {
      const studentData = componentState.studentData;
      if (studentData != null) {
        if (studentData.frequenciesPlayed != null && studentData.frequenciesPlayed.length > 0) {
          return true;
        }
      }
    }
    return false;
  }
}
