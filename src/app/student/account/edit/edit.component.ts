import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { StudentEditProfileComponent } from '../edit-profile/edit-profile.component';
import { EditPasswordComponent } from '../../../modules/shared/edit-password/edit-password.component';

@Component({
  imports: [MatIcon, MatTabGroup, MatTab, StudentEditProfileComponent, EditPasswordComponent],
  templateUrl: './edit.component.html'
})
export class EditComponent {}
