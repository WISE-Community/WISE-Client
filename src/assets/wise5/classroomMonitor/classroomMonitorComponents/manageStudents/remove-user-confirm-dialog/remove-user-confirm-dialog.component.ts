import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-user-confirm-dialog',
  templateUrl: './remove-user-confirm-dialog.component.html',
  styleUrls: ['./remove-user-confirm-dialog.component.scss']
})
export class RemoveUserConfirmDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public user: any) {}

  ngOnInit(): void {}
}
