import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { TeacherRun } from '../teacher-run';
import { TeacherService } from '../teacher.service';
import { ListClassroomCoursesDialogComponent } from '../list-classroom-courses-dialog/list-classroom-courses-dialog.component';
import { AccessLinkService } from '../../services/accessLinkService';

@Component({
  selector: 'app-share-run-code-dialog',
  templateUrl: './share-run-code-dialog.component.html',
  styleUrls: ['./share-run-code-dialog.component.scss'],
  standalone: false
})
export class ShareRunCodeDialogComponent {
  protected accessLinks: string[] = [];
  protected code: string;
  protected link: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public run: TeacherRun,
    private accessLinkService: AccessLinkService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private teacherService: TeacherService,
    private userService: UserService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.code = this.run.runCode;
    const host = this.configService.getWISEHostname() + this.configService.getContextPath();
    this.link = `${host}/login?accessCode=${this.code}`;
    if (this.run.isSurveyRun()) {
      this.accessLinks = this.accessLinkService.getAccessLinks(this.run.runCode, this.run.periods);
    }
  }

  copyMsg() {
    this.snackBar.open($localize`Copied to clipboard.`);
  }

  isGoogleUser() {
    return this.userService.isGoogleUser();
  }

  isGoogleClassroomEnabled() {
    return this.configService.isGoogleClassroomEnabled();
  }

  checkClassroomAuthorization() {
    this.teacherService
      .getClassroomAuthorizationUrl(this.userService.getUser().getValue().username)
      .subscribe(({ authorizationUrl }) => {
        if (authorizationUrl == null) {
          this.getClassroomCourses();
        } else {
          const authWindow = window.open(authorizationUrl, 'authorize', 'width=600,height=800');
          const timer = setInterval(() => {
            if (authWindow.closed) {
              clearInterval(timer);
              this.checkClassroomAuthorization();
            }
          }, 1000);
        }
      });
  }

  getClassroomCourses() {
    this.teacherService
      .getClassroomCourses(this.userService.getUser().getValue().username)
      .subscribe((courses) => {
        const panelClass = courses.length ? 'dialog-md' : '';
        this.dialog.open(ListClassroomCoursesDialogComponent, {
          data: { run: this.run, courses },
          panelClass: panelClass
        });
      });
  }

  protected getPeriodFromAccessLink(link: string): string {
    return this.accessLinkService.getPeriodFromAccessLink(link);
  }
}
