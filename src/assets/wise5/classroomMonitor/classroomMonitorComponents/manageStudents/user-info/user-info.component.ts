import { Component, Input } from '@angular/core';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.component.html'
})
export class UserInfoComponent {
  @Input() user: any;
}
