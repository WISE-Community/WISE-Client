import { NgModule } from '@angular/core';
import { DragAndDropDirective } from './drag-and-drop.directive';

@NgModule({
  declarations: [DragAndDropDirective],
  exports: [DragAndDropDirective]
})
export class DragAndDropModule {}
