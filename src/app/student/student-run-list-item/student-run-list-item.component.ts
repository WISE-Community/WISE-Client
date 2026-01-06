import { Component, OnInit, Input, inject } from '@angular/core';
import { StudentRun } from '../student-run';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser';
import { ConfigService } from '../../services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamSignInDialogComponent } from '../team-sign-in-dialog/team-sign-in-dialog.component';
import { Student } from '../../domain/student';
import { StudentService } from '../student.service';
import { UserService } from '../../services/user.service';
import { flash } from '../../animations';
import {
  MatCard,
  MatCardContent,
  MatCardAvatar,
  MatCardTitle,
  MatCardSubtitle,
  MatCardActions
} from '@angular/material/card';
import { NgClass, NgTemplateOutlet, DatePipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  animations: [flash],
  imports: [
    MatCard,
    NgClass,
    MatCardContent,
    MatCardAvatar,
    MatTooltip,
    MatCardTitle,
    MatCardSubtitle,
    NgTemplateOutlet,
    MatCardActions,
    MatButton,
    MatIcon,
    DatePipe
  ],
  selector: 'app-student-run-list-item',
  styleUrl: './student-run-list-item.component.scss',
  templateUrl: './student-run-list-item.component.html'
})
export class StudentRunListItemComponent implements OnInit {
  private configService = inject(ConfigService);
  dialog = inject(MatDialog);
  private sanitizer = inject(DomSanitizer);
  private studentService = inject(StudentService);
  private userService = inject(UserService);

  @Input() run: StudentRun = new StudentRun();

  problemLink: string = '';
  thumbStyle: SafeStyle;
  animateDuration: string = '0s';
  animateDelay: string = '0s';

  getThumbStyle() {
    const DEFAULT_THUMB = 'assets/img/default-picture.svg';
    const STYLE = `url(${this.run.project.projectThumb}), url(${DEFAULT_THUMB})`;
    return this.sanitizer.bypassSecurityTrustStyle(STYLE);
  }

  ngOnInit() {
    this.thumbStyle = this.getThumbStyle();
    this.problemLink = `${this.configService.getContextPath()}/contact?runId=${this.run.id}`;
    if (this.run.isHighlighted) {
      this.animateDuration = '2s';
      this.animateDelay = '1s';
      setTimeout(() => {
        this.run.isHighlighted = false;
      }, 7000);
    }
  }

  launchRun() {
    if (this.run.maxStudentsPerTeam === 1) {
      this.skipTeamSignIn();
    } else {
      this.dialog.open(TeamSignInDialogComponent, {
        data: { run: this.run },
        panelClass: 'dialog-sm',
        disableClose: true
      });
    }
  }

  reviewRun() {
    this.skipTeamSignIn();
  }

  skipTeamSignIn() {
    const user = <Student>this.userService.getUser().getValue();
    const presentUserIds = [user.id];
    const absentUserIds = [];
    this.studentService
      .launchRun(this.run.id, this.run.workgroupId, presentUserIds, absentUserIds)
      .subscribe((response: any) => {
        window.location.href = response.startProjectUrl;
      });
  }

  isRunActive(run) {
    return run.isActive(this.configService.getCurrentServerTime());
  }

  isRunCompleted(run) {
    return run.isCompleted(this.configService.getCurrentServerTime());
  }
}
