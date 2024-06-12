import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../modules/shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from './teacher.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { AuthGuard } from './auth.guard';
import { TeacherRunListComponent } from './teacher-run-list/teacher-run-list.component';
import { TeacherRunListItemComponent } from './teacher-run-list-item/teacher-run-list-item.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { RunMenuComponent } from './run-menu/run-menu.component';
import { CreateRunDialogComponent } from './create-run-dialog/create-run-dialog.component';
import { LibraryModule } from '../modules/library/library.module';
import { ShareRunDialogComponent } from './share-run-dialog/share-run-dialog.component';
import { TimelineModule } from '../modules/timeline/timeline.module';
import { EditComponent } from './account/edit/edit.component';
import { TeacherEditProfileComponent } from './account/edit-profile/edit-profile.component';
import { RunSettingsDialogComponent } from './run-settings-dialog/run-settings-dialog.component';
import { EditRunWarningDialogComponent } from './edit-run-warning-dialog/edit-run-warning-dialog.component';
import { ListClassroomCoursesDialogComponent } from './list-classroom-courses-dialog/list-classroom-courses-dialog.component';
import { DiscourseRecentActivityComponent } from './discourse-recent-activity/discourse-recent-activity.component';
import { ShareRunCodeDialogComponent } from './share-run-code-dialog/share-run-code-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectRunsControlsModule } from './select-runs-controls/select-runs-controls.module';
import { SearchBarComponent } from '../modules/shared/search-bar/search-bar.component';
import { ApplyTagsButtonComponent } from './apply-tags-button/apply-tags-button.component';
import { ProjectTagService } from '../../assets/wise5/services/projectTagService';
import { SelectTagsComponent } from './select-tags/select-tags.component';
import { SelectedTagsListComponent } from './selected-tags-list/selected-tags-list.component';
import { UnitTagsComponent } from './unit-tags/unit-tags.component';
import { ColorService } from '../../assets/wise5/services/colorService';

const materialModules = [
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
];
@NgModule({
  imports: [
    ApplyTagsButtonComponent,
    CommonModule,
    DiscourseRecentActivityComponent,
    FlexLayoutModule,
    FormsModule,
    LibraryModule,
    materialModules,
    SearchBarComponent,
    SelectedTagsListComponent,
    SelectRunsControlsModule,
    SelectTagsComponent,
    SharedModule,
    TeacherRoutingModule,
    TimelineModule,
    ClipboardModule,
    UnitTagsComponent
  ],
  declarations: [
    CreateRunDialogComponent,
    EditComponent,
    EditRunWarningDialogComponent,
    ListClassroomCoursesDialogComponent,
    RunMenuComponent,
    RunSettingsDialogComponent,
    ShareRunCodeDialogComponent,
    ShareRunDialogComponent,
    TeacherComponent,
    TeacherEditProfileComponent,
    TeacherHomeComponent,
    TeacherRunListComponent,
    TeacherRunListItemComponent
  ],
  providers: [AuthGuard, ColorService, ProjectTagService],
  exports: [TeacherComponent, UnitTagsComponent, materialModules]
})
export class TeacherModule {}
