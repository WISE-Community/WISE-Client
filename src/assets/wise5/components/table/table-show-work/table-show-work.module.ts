import { NgModule } from '@angular/core';
import { TableShowWorkComponent } from './table-show-work.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TabulatorTableComponent } from '../tabulator-table/tabulator-table.component';

@NgModule({
  declarations: [TableShowWorkComponent],
  imports: [MatFormFieldModule, MatSelectModule, TabulatorTableComponent],
  exports: [TableShowWorkComponent]
})
export class TableShowWorkModule {}
