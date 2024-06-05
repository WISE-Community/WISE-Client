import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatProgressBarModule,
  MatTabsModule,
  MatTooltipModule
];

import { SharedModule } from '../modules/shared/shared.module';
import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentRunListComponent } from './student-run-list/student-run-list.component';
import { StudentRunListItemComponent } from './student-run-list-item/student-run-list-item.component';
import { AuthGuard } from './auth.guard';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';
import { EditComponent } from './account/edit/edit.component';
import { StudentEditProfileComponent } from './account/edit-profile/edit-profile.component';
import { TimelineModule } from '../modules/timeline/timeline.module';
import { TeamSignInDialogComponent } from './team-sign-in-dialog/team-sign-in-dialog.component';
import { GoogleSignInButtonComponent } from '../modules/google-sign-in/google-sign-in-button/google-sign-in-button.component';
import { SearchBarComponent } from '../modules/shared/search-bar/search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    GoogleSignInButtonComponent,
    ReactiveFormsModule,
    materialModules,
    SearchBarComponent,
    SharedModule,
    StudentRoutingModule,
    TimelineModule
  ],
  declarations: [
    AddProjectDialogComponent,
    StudentComponent,
    StudentHomeComponent,
    StudentRunListComponent,
    StudentRunListItemComponent,
    EditComponent,
    StudentEditProfileComponent,
    TeamSignInDialogComponent
  ],
  providers: [AuthGuard],
  exports: [StudentComponent, materialModules]
})
export class StudentModule {}
