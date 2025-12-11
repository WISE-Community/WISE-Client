import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../modules/shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { AuthGuard } from './auth.guard';
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
import { LibraryModule } from '../modules/library/library.module';
import { EditComponent } from './account/edit/edit.component';
import { TeacherEditProfileComponent } from './account/edit-profile/edit-profile.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SearchBarComponent } from '../modules/shared/search-bar/search-bar.component';
import { ApplyTagsButtonComponent } from './apply-tags-button/apply-tags-button.component';
import { ProjectTagService } from '../../assets/wise5/services/projectTagService';
import { SelectTagsComponent } from './select-tags/select-tags.component';
import { UnitTagsComponent } from './unit-tags/unit-tags.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccessLinkService } from '../services/accessLinkService';

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
    FormsModule,
    LibraryModule,
    materialModules,
    NgSelectModule,
    SearchBarComponent,
    SelectTagsComponent,
    SharedModule,
    TeacherRoutingModule,
    ClipboardModule,
    UnitTagsComponent,
    EditComponent,
    TeacherEditProfileComponent
  ],
  providers: [AccessLinkService, AuthGuard, ProjectTagService],
  exports: [UnitTagsComponent, materialModules]
})
export class TeacherModule {}
