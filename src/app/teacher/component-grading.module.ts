import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AnimationGrading } from '../../assets/wise5/components/animation/animation-grading/animation-grading.component';
import { AudioOscillatorGrading } from '../../assets/wise5/components/audioOscillator/audio-oscillator-grading/audio-oscillator-grading.component';
import { DialogGuidanceGradingComponent } from '../../assets/wise5/components/dialogGuidance/dialog-guidance-grading/dialog-guidance-grading.component';
import { DiscussionGrading } from '../../assets/wise5/components/discussion/discussion-grading/discussion-grading.component';
import { EmbeddedGrading } from '../../assets/wise5/components/embedded/embedded-grading/embedded-grading.component';
import { AngularJSModule } from '../common-hybrid-angular.module';

@NgModule({
  declarations: [
    AnimationGrading,
    AudioOscillatorGrading,
    DialogGuidanceGradingComponent,
    DiscussionGrading,
    EmbeddedGrading
  ],
  imports: [AngularJSModule, HighchartsChartModule],
  exports: [
    AnimationGrading,
    AudioOscillatorGrading,
    DialogGuidanceGradingComponent,
    DiscussionGrading,
    EmbeddedGrading
  ]
})
export class ComponentGradingModule {}
