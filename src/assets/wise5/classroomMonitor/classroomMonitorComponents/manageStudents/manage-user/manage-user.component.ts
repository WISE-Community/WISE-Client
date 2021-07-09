import { Component, Input } from '@angular/core';

@Component({
  selector: 'manage-user',
  templateUrl: 'manage-user.component.html'
})
export class ManageUserComponent {
  @Input() user: any;
}
