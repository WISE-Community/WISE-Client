import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'audio-oscillator-show-work',
  templateUrl: 'audio-oscillator-show-work.component.html'
})
export class AudioOscillatorShowWorkComponent extends ComponentShowWorkDirective {
  amplitudesPlayed: string;
  amplitudesPlayedSorted: string;
  frequenciesPlayed: string;
  frequenciesPlayedSorted: string;
  isAmplitudeDataPresent: boolean;
  maxAmplitudePlayed: number;
  maxFrequencyPlayed: number;
  minAmplitudePlayed: number;
  minFrequencyPlayed: number;
  numberOfAmplitudesPlayed: number;
  numberOfFrequenciesPlayed: number;
  numberOfUniqueAmplitudesPlayed: number;
  numberOfUniqueFrequenciesPlayed: number;

  constructor(protected nodeService: NodeService, protected ProjectService: ProjectService) {
    super(nodeService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const studentData = this.componentState.studentData;
    this.initializeFrequencies(studentData);
    this.initializeAmplitudes(studentData);
  }

  initializeFrequencies(studentData: any): void {
    this.frequenciesPlayed = studentData.frequenciesPlayed.join(', ');
    this.frequenciesPlayedSorted = studentData.frequenciesPlayedSorted.join(', ');
    this.numberOfFrequenciesPlayed = studentData.numberOfFrequenciesPlayed;
    this.numberOfUniqueFrequenciesPlayed = studentData.numberOfUniqueFrequenciesPlayed;
    this.minFrequencyPlayed = studentData.minFrequencyPlayed;
    this.maxFrequencyPlayed = studentData.maxFrequencyPlayed;
  }

  initializeAmplitudes(studentData: any): void {
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
