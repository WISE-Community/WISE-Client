import { NgModule } from '@angular/core';
import { TableShowWorkModule } from '../table-show-work/table-show-work.module';
import { TableGradingComponent } from './table-grading.component';
import { TabulatorTableComponent } from '../tabulator-table/tabulator-table.component';

@NgModule({
  declarations: [TableGradingComponent],
  imports: [TableShowWorkModule, TabulatorTableComponent],
  exports: [TableGradingComponent]
})
export class TableGradingModule {}
