import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../../services/configService';

@Component({
  imports: [CommonModule],
  selector: 'show-student-info',
  standalone: true,
  template: `
    <span class="username">
      @if (canViewStudentNames) {
        <strong>{{ user.name }}</strong> ({{ user.username }})
      } @else {
        <strong i8n>Student {{ user.id }}</strong>
      }
    </span>
  `
})
export class ShowStudentInfoComponent implements OnInit {
  @Input() user: any;
  protected canViewStudentNames: boolean;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
  }
}
