import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HelpIconComponent } from './help-icon.component';

@NgModule({
  declarations: [HelpIconComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [HelpIconComponent]
})
export class HelpIconModule {}
