import { NgModule } from '@angular/core';
import { ApplyTagsButtonComponent } from './apply-tags-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ManageTagsDialogComponent } from '../manage-tags-dialog/manage-tags-dialog.component';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { SelectAllItemsCheckboxModule } from '../../modules/library/select-all-items-checkbox/select-all-items-checkbox.module';

@NgModule({
  declarations: [ApplyTagsButtonComponent],
  exports: [ApplyTagsButtonComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ManageTagsDialogComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    SelectAllItemsCheckboxModule,
    StudentTeacherCommonServicesModule
  ],
  providers: [ProjectTagService]
})
export class ApplyTagsButtonModule {}
