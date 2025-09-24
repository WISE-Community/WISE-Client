import { NgModule } from '@angular/core';
import { TableGradingComponent } from './table-grading.component';
import { TableShowWorkComponent } from '../table-show-work/table-show-work.component';

@NgModule({
  declarations: [TableGradingComponent],
  imports: [TableShowWorkComponent],
  exports: [TableGradingComponent]
})
export class TableGradingModule {}
