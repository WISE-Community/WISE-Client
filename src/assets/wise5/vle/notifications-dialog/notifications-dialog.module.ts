import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationsDialogComponent } from './notifications-dialog.component';

@NgModule({
  declarations: [NotificationsDialogComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  exports: [NotificationsDialogComponent]
})
export class NotificationsDialogModule {}
