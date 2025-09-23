import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../domain/user';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';

@Component({
  selector: 'app-student-home',
  standalone: false,
  styleUrl: './student-home.component.scss',
  templateUrl: './student-home.component.html'
})
export class StudentHomeComponent implements OnInit {
  user: User = new User();

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {}

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
