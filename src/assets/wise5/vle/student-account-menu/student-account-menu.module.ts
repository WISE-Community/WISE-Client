import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StudentAccountMenuComponent } from './student-account-menu.component';

@NgModule({
  declarations: [StudentAccountMenuComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule
  ],
  exports: [StudentAccountMenuComponent]
})
export class StudentAccountMenuModule {}
