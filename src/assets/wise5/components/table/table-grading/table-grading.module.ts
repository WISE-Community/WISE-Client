import { NgModule } from '@angular/core';
import { TableShowWorkModule } from '../table-show-work/table-show-work.module';
import { TableGradingComponent } from './table-grading.component';

@NgModule({
  declarations: [TableGradingComponent],
  imports: [TableShowWorkModule],
  exports: [TableGradingComponent]
})
export class TableGradingModule {}
