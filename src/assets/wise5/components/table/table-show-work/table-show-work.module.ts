import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../../app/common-hybrid-angular.module';
import { TableShowWorkComponent } from './table-show-work.component';

@NgModule({
  declarations: [TableShowWorkComponent],
  imports: [AngularJSModule],
  exports: [TableShowWorkComponent]
})
export class TableShowWorkModule {}
