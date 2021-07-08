import { Component, Input } from '@angular/core';

@Component({
  selector: 'team-info',
  styleUrls: ['team-info.component.scss'],
  templateUrl: 'team-info.component.html'
})
export class TeamInfoComponent {
  @Input() team: any;
}
