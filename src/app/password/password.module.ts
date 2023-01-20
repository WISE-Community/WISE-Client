import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmNewPasswordComponent } from './confirm-new-password/confirm-new-password.component';
import { NewPasswordAndConfirmComponent } from './new-password-and-confirm/new-password-and-confirm.component';
import { NewPasswordComponent } from './new-password/new-password.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [ConfirmNewPasswordComponent, NewPasswordAndConfirmComponent, NewPasswordComponent],
  exports: [NewPasswordAndConfirmComponent]
})
export class PasswordModule {}
