import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { TeacherEditProfileComponent } from '../edit-profile/edit-profile.component';
import { SharedModule } from '../../../modules/shared/shared.module';

@Component({
  imports: [MatIcon, MatTabGroup, MatTab, TeacherEditProfileComponent, SharedModule],
  templateUrl: './edit.component.html'
})
export class EditComponent {}
