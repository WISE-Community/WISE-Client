import { NgModule } from '@angular/core';
import { SaveTimeMessageComponent } from '../save-time-message/save-time-message.component';
import { ComponentStateInfoComponent } from './component-state-info.component';

@NgModule({
  declarations: [ComponentStateInfoComponent],
  imports: [SaveTimeMessageComponent],
  exports: [ComponentStateInfoComponent, SaveTimeMessageComponent]
})
export class ComponentStateInfoModule {}
