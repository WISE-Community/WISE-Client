import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SelectRunsControlsComponent } from './select-runs-controls.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SelectRunsControlsComponent],
  exports: [SelectRunsControlsComponent],
  imports: [
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ]
})
export class SelectRunsControlsModule {}
