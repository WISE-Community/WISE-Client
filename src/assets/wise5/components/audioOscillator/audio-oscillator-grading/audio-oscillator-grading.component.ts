import { Component } from '@angular/core';
import { ComponentGrading } from '../../../classroomMonitor/classroomMonitorComponents/shared/component-grading.component';

@Component({
  selector: 'audio-oscillator-grading',
  templateUrl: 'audio-oscillator-grading.component.html'
})
export class AudioOscillatorGrading extends ComponentGrading {
  frequenciesPlayed: string;
  frequenciesPlayedSorted: string;
  numberOfFrequenciesPlayed: number = 0;
  minFrequencyPlayed: number;
  maxFrequencyPlayed: number;

  ngOnInit(): void {
    super.ngOnInit();
    const studentData = this.componentState.studentData;
    this.frequenciesPlayed = studentData.frequenciesPlayed.join(', ');
    this.frequenciesPlayedSorted = studentData.frequenciesPlayedSorted.join(', ');
    this.numberOfFrequenciesPlayed = studentData.numberOfFrequenciesPlayed;
    this.minFrequencyPlayed = studentData.minFrequencyPlayed;
    this.maxFrequencyPlayed = studentData.maxFrequencyPlayed;
  }
}
