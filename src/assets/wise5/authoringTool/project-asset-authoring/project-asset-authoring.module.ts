import { NgModule } from '@angular/core';
import { ProjectAssetAuthoringComponent } from './project-asset-authoring.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragAndDropModule } from '../../common/drag-and-drop/drag-and-drop.module';
import { FileSizePipe } from '../file-size/filesize.pipe';

@NgModule({
  declarations: [ProjectAssetAuthoringComponent],
  imports: [
    CommonModule,
    DragAndDropModule,
    FileSizePipe,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule
  ],
  exports: [ProjectAssetAuthoringComponent],
  bootstrap: [ProjectAssetAuthoringComponent]
})
export class ProjectAssetAuthoringModule {}
