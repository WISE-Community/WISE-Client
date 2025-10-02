import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'audio-oscillator-show-work',
  templateUrl: 'audio-oscillator-show-work.component.html'
})
export class AudioOscillatorShowWorkComponent extends ComponentShowWorkDirective {
  protected amplitudesPlayed: string;
  protected amplitudesPlayedSorted: string;
  protected frequenciesPlayed: string;
  protected frequenciesPlayedSorted: string;
  protected isAmplitudeDataPresent: boolean;
  protected maxAmplitudePlayed: number;
  protected maxFrequencyPlayed: number;
  protected minAmplitudePlayed: number;
  protected minFrequencyPlayed: number;
  protected numberOfAmplitudesPlayed: number;
  protected numberOfFrequenciesPlayed: number;
  protected numberOfUniqueAmplitudesPlayed: number;
  protected numberOfUniqueFrequenciesPlayed: number;

  ngOnInit(): void {
    super.ngOnInit();
    const studentData = this.componentState.studentData;
    this.initializeFrequencies(studentData);
    this.initializeAmplitudes(studentData);
  }

  protected initializeFrequencies(studentData: any): void {
    this.frequenciesPlayed = studentData.frequenciesPlayed.join(', ');
    this.frequenciesPlayedSorted = studentData.frequenciesPlayedSorted.join(', ');
    this.numberOfFrequenciesPlayed = studentData.numberOfFrequenciesPlayed;
    this.numberOfUniqueFrequenciesPlayed = studentData.numberOfUniqueFrequenciesPlayed;
    this.minFrequencyPlayed = studentData.minFrequencyPlayed;
    this.maxFrequencyPlayed = studentData.maxFrequencyPlayed;
  }

  protected initializeAmplitudes(studentData: any): void {
    if (studentData.amplitudesPlayed != null) {
      this.amplitudesPlayed = studentData.amplitudesPlayed.join(', ');
      this.amplitudesPlayedSorted = studentData.amplitudesPlayedSorted.join(', ');
      this.numberOfAmplitudesPlayed = studentData.numberOfAmplitudesPlayed;
      this.numberOfUniqueAmplitudesPlayed = studentData.numberOfUniqueAmplitudesPlayed;
      this.minAmplitudePlayed = studentData.minAmplitudePlayed;
      this.maxAmplitudePlayed = studentData.maxAmplitudePlayed;
    }
  }
}
