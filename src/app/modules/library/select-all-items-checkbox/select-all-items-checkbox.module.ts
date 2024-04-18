import { NgModule } from '@angular/core';
import { SelectAllItemsCheckboxComponent } from './select-all-items-checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SelectAllItemsCheckboxComponent],
  exports: [SelectAllItemsCheckboxComponent],
  imports: [MatCheckboxModule, MatTooltipModule]
})
export class SelectAllItemsCheckboxModule {}
