import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { TeacherRun } from '../teacher-run';
import { TeacherService } from '../teacher.service';
import { ListClassroomCoursesDialogComponent } from '../list-classroom-courses-dialog/list-classroom-courses-dialog.component';
import { AccessLinkService } from '../../services/accessLinkService';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [
    ClipboardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  styleUrl: './share-run-code-dialog.component.scss',
  templateUrl: './share-run-code-dialog.component.html'
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

  ngOnInit(): void {
    this.code = this.run.runCode;
    const host = this.configService.getWISEHostname() + this.configService.getContextPath();
    this.link = `${host}/login?accessCode=${this.code}`;
    if (this.run.isSurveyRun()) {
      this.accessLinks = this.accessLinkService.getAccessLinks(this.run.runCode, this.run.periods);
    }
  }

  protected copyMsg(): void {
    this.snackBar.open($localize`Copied to clipboard.`);
  }

  protected isGoogleUser(): boolean {
    return this.userService.isGoogleUser();
  }

  protected isGoogleClassroomEnabled(): boolean {
    return this.configService.isGoogleClassroomEnabled();
  }

  protected checkClassroomAuthorization(): void {
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

  private getClassroomCourses(): void {
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
