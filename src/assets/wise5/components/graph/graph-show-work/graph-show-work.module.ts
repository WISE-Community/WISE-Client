import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { GraphShowWorkComponent } from './graph-show-work.component';

@NgModule({
  declarations: [GraphShowWorkComponent],
  imports: [HighchartsChartModule],
  exports: [GraphShowWorkComponent]
})
export class GraphShowWorkModule {}
