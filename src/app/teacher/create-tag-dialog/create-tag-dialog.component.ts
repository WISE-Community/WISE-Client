import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TagService } from '../../../assets/wise5/services/tagService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'create-tag-dialog',
  templateUrl: './create-tag-dialog.component.html',
  styleUrls: ['./create-tag-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CreateTagDialogComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  protected tagName: string = '';

  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    private snackBar: MatSnackBar,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.tagService.newTag$.subscribe(() => {
        this.snackBar.open($localize`Tag created`);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected keyPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.create();
    }
  }

  protected create(): void {
    this.tagService.createTag(this.tagName);
    this.dialogRef.close();
  }
}
