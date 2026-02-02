import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../domain/user';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { StudentRunListComponent } from '../student-run-list/student-run-list.component';

@Component({
  imports: [MatIcon, MatButton, StudentRunListComponent],
  selector: 'app-student-home',
  styleUrl: './student-home.component.scss',
  templateUrl: './student-home.component.html'
})
export class StudentHomeComponent implements OnInit {
  dialog = inject(MatDialog);
  private userService = inject(UserService);

  user: User = new User();

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  showAddRun(): void {
    this.dialog.open(AddProjectDialogComponent);
  }
}
