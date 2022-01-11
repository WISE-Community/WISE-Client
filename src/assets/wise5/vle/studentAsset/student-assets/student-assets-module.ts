import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragAndDropDirective } from '../../../common/drag-and-drop/drag-and-drop.directive';
import { StudentAssetsComponent } from './student-assets.component';

@NgModule({
  declarations: [DragAndDropDirective, StudentAssetsComponent],
  imports: [CommonModule],
  exports: [StudentAssetsComponent]
})
export class StudentAssetsModule {}
