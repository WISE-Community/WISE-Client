import { NgModule } from '@angular/core';
import { TableCommonModule } from '../table-common.module';
import { TableShowWorkComponent } from './table-show-work.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [TableShowWorkComponent],
  imports: [MatFormFieldModule, MatSelectModule, TableCommonModule],
  exports: [TableShowWorkComponent]
})
export class TableShowWorkModule {}
