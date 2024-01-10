import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'show-student-info',
  templateUrl: './show-student-info.component.html',
  styleUrls: ['./show-student-info.component.scss']
})
export class ShowStudentInfoComponent implements OnInit {
  @Input() user: any;
  canViewStudentNames: boolean;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
  }
}
