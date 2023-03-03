import { NgModule } from '@angular/core';
import { ShowGroupWorkDisplayModule } from '../show-group-work-display/show-group-work-display.module';
import { ShowGroupWorkGradingComponent } from './show-group-work-grading.component';

@NgModule({
  declarations: [ShowGroupWorkGradingComponent],
  imports: [ShowGroupWorkDisplayModule],
  exports: [ShowGroupWorkGradingComponent]
})
export class ShowGroupWorkGradingModule {}
