import { ComponentInfo } from '../ComponentInfo';

export class AudioOscillatorInfo extends ComponentInfo {
  protected description: string = $localize`Students change the frequency and amplitude of a sound wave. They listen to the resulting sounds and view graphs of the waves.`;
  protected label: string = $localize`Audio Oscillator`;
  protected previewExamples: any[] = [
    {
      label: $localize`Audio Oscillator`,
      content: {
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
      }
    }
  ];
}
