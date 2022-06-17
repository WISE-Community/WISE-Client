import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SaveTimeMessageComponent } from '../save-time-message/save-time-message.component';
import { ComponentStateInfoComponent } from './component-state-info.component';

@NgModule({
  declarations: [ComponentStateInfoComponent, SaveTimeMessageComponent],
  imports: [CommonModule, MatTooltipModule],
  exports: [ComponentStateInfoComponent, SaveTimeMessageComponent]
})
export class ComponentStateInfoModule {}
