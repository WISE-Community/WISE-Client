import { NgModule } from '@angular/core';
import { ProjectAssetAuthoringComponent } from './project-asset-authoring.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxFilesizeModule } from 'ngx-filesize';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProjectAssetAuthoringComponent],
  imports: [
    CommonModule,
    FileUploadModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    NgxFilesizeModule
  ]
})
export class ProjectAssetAuthoringModule {}
