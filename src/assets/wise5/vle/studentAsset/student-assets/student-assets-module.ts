import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragAndDropModule } from '../../../common/drag-and-drop/drag-and-drop.module';
import { StudentAssetsComponent } from './student-assets.component';

@NgModule({
  declarations: [StudentAssetsComponent],
  imports: [CommonModule, DragAndDropModule],
  exports: [StudentAssetsComponent]
})
export class StudentAssetsModule {}
