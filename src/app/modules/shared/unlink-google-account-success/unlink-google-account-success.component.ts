import { Component } from '@angular/core';
import { Teacher } from '../../../domain/teacher';
import { UserService } from '../../../services/user.service';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  styleUrl: 'unlink-google-account-success.component.scss',
  templateUrl: 'unlink-google-account-success.component.html'
})
export class UnlinkGoogleAccountSuccessComponent {
  username: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const user = <Teacher>this.userService.getUser().getValue();
    this.username = user.username;
  }
}
