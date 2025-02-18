import { NgModule } from '@angular/core';
import { TableCommonModule } from '../table-common.module';
import { TableShowWorkComponent } from './table-show-work.component';

@NgModule({
  declarations: [TableShowWorkComponent],
  imports: [TableCommonModule],
  exports: [TableShowWorkComponent]
})
export class TableShowWorkModule {}
