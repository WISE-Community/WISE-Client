import { NgModule } from '@angular/core';
import { TableCommonModule } from '../table-common.module';
import { TableShowWorkModule } from '../table-show-work/table-show-work.module';
import { TableGradingComponent } from './table-grading.component';

@NgModule({
  declarations: [TableGradingComponent],
  imports: [TableShowWorkModule, TableCommonModule],
  exports: [TableGradingComponent]
})
export class TableGradingModule {}
