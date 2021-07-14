import { Component, Input } from '@angular/core';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'manage-user',
  templateUrl: 'manage-user.component.html'
})
export class ManageUserComponent {
  @Input() user: any;

  canViewStudentNames: boolean;

  constructor(private ConfigService: ConfigService) {}

  ngOnInit() {
    this.canViewStudentNames = this.ConfigService.getPermissions().canViewStudentNames;
  }
}
