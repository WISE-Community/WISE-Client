import { Component, Input } from '@angular/core';

@Component({
  selector: 'match-status-icon',
  templateUrl: 'match-status-icon.component.html'
})
export class MatchStatusIcon {
  @Input()
  status: string;
}
