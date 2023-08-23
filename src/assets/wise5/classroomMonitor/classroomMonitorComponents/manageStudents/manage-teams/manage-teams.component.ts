import { Component, Input } from '@angular/core';

@Component({
  selector: 'manage-teams',
  styleUrls: ['manage-teams.component.scss'],
  templateUrl: 'manage-teams.component.html'
})
export class ManageTeamsComponent {
  @Input() protected teams: any;
}
