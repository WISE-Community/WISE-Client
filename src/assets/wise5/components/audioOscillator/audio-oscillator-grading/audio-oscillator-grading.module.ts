import { NgModule } from '@angular/core';
import { AudioOscillatorShowWorkModule } from '../audio-oscillator-show-work/audio-oscillator-show-work.module';
import { AudioOscillatorGradingComponent } from './audio-oscillator-grading.component';

@NgModule({
  declarations: [AudioOscillatorGradingComponent],
  imports: [AudioOscillatorShowWorkModule],
  exports: [AudioOscillatorGradingComponent]
})
export class AudioOscillatorGradingModule {}
