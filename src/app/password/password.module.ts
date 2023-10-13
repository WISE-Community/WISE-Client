import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewPasswordAndConfirmComponent } from './new-password-and-confirm/new-password-and-confirm.component';
import { MatIconModule } from '@angular/material/icon';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { PasswordRequirementComponent } from './password-requirement/password-requirement.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    PasswordStrengthMeterModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [NewPasswordAndConfirmComponent, PasswordRequirementComponent],
  exports: [NewPasswordAndConfirmComponent]
})
export class PasswordModule {}
