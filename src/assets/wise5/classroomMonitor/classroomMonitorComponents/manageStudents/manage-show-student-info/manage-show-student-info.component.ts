import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'manage-show-student-info',
  styleUrls: ['./manage-show-student-info.component.scss'],
  templateUrl: './manage-show-student-info.component.html'
})
export class ManageShowStudentInfoComponent {
  canViewStudentNames: boolean;

  constructor(
    protected dialog: MatDialog,
    private configService: ConfigService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  ngOnInit() {
    this.canViewStudentNames = this.configService.getPermissions().canViewStudentNames;
    this.http.get(`/api/user/info/${this.user.id}`).subscribe((userInfo) => {
      Object.assign(this.user, userInfo);
    });
  }
}
