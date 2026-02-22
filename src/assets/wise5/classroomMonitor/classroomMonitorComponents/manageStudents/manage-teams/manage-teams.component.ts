import { Component, Input } from '@angular/core';
import { ManageTeamComponent } from '../manage-team/manage-team.component';
import { KeyValuePipe } from '@angular/common';

@Component({
  imports: [ManageTeamComponent, KeyValuePipe],
  selector: 'manage-teams',
  styleUrl: 'manage-teams.component.scss',
  templateUrl: 'manage-teams.component.html'
})
export class ManageTeamsComponent {
  @Input() protected teams: any;
}
