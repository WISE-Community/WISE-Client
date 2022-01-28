import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationsMenuModule } from '../../../assets/wise5/vle/notifications-menu/notifications-menu.module';
import { StudentAccountMenuModule } from '../../../assets/wise5/vle/student-account-menu/student-account-menu.module';
import { TopBarComponent } from './top-bar.component';

@NgModule({
  declarations: [TopBarComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    NotificationsMenuModule,
    StudentAccountMenuModule
  ],
  exports: [TopBarComponent]
})
export class TopBarModule {}
