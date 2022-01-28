import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationsMenuComponent } from './notifications-menu.component';

@NgModule({
  declarations: [NotificationsMenuComponent],
  imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatIconModule, MatToolbarModule],
  exports: [NotificationsMenuComponent]
})
export class NotificationsMenuModule {}
