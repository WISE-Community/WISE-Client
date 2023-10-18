import { ComponentInfo } from '../ComponentInfo';

export class AudioOscillatorInfo extends ComponentInfo {
  description: string = $localize`The student changes the frequency of a sound wave while they listen to it.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'AudioOscillator',
    prompt:
      'Press play to listen to the sound wave and change the frequency to hear the difference.',
    showSaveButton: false,
    showSubmitButton: false,
    oscillatorTypes: ['sine'],
    startingAmplitude: 44,
    startingFrequency: 440,
    oscilloscopeWidth: 800,
    oscilloscopeHeight: 400,
    gridCellSize: 50,
    stopAfterGoodDraw: true,
    canStudentEditAmplitude: true,
    canStudentEditFrequency: true,
    canStudentViewAmplitudeInput: true,
    canStudentViewFrequencyInput: true,
    constraints: []
  };
}
