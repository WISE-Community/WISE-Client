import { NgModule } from '@angular/core';
import { SaveIndicatorComponent } from './save-indicator.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SaveIndicatorComponent],
  exports: [SaveIndicatorComponent],
  imports: [CommonModule, FlexLayoutModule, MatProgressSpinnerModule]
})
export class SaveIndicatorModule {}
