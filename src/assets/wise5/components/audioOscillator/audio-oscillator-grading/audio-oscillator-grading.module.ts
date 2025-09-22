import { NgModule } from '@angular/core';
import { AudioOscillatorGradingComponent } from './audio-oscillator-grading.component';
import { AudioOscillatorShowWorkComponent } from '../audio-oscillator-show-work/audio-oscillator-show-work.component';

@NgModule({
  declarations: [AudioOscillatorGradingComponent],
  imports: [AudioOscillatorShowWorkComponent],
  exports: [AudioOscillatorGradingComponent]
})
export class AudioOscillatorGradingModule {}
