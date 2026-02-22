import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'show-student-info',
  template: `
    @if (canViewStudentNames) {
      <span class="username"
        ><strong>{{ user.name }}</strong> ({{ user.username }})</span
      >
    } @else {
      <span class="username"
        ><strong i18n>Student {{ user.id }}</strong></span
      >
    }
  `
})
export class ShowStudentInfoComponent implements OnInit {
  protected canViewStudentNames: boolean;
  @Input() user: any;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
  }
}
