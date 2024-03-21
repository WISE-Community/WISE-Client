import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DismissAmbientNotificationDialogModule } from '../../../assets/wise5/vle/dismiss-ambient-notification-dialog/dismiss-ambient-notification-dialog.module';
import { NotificationsDialogModule } from '../../../assets/wise5/vle/notifications-dialog/notifications-dialog.module';
import { StudentAccountMenuModule } from '../../../assets/wise5/vle/student-account-menu/student-account-menu.module';
import { TopBarComponent } from './top-bar.component';
import { ProjectLanguageChooserComponent } from '../../common/project-language-chooser/project-language-chooser.component';

@NgModule({
  declarations: [TopBarComponent],
  imports: [
    CommonModule,
    DismissAmbientNotificationDialogModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    NotificationsDialogModule,
    ProjectLanguageChooserComponent,
    StudentAccountMenuModule
  ],
  exports: [TopBarComponent]
})
export class TopBarModule {}
