import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WiseLinkComponent } from './wise-link.component';

@NgModule({
  declarations: [WiseLinkComponent],
  imports: [CommonModule, MatButtonModule, MatTooltipModule],
  exports: [WiseLinkComponent]
})
export class WiseLinkModule {}
