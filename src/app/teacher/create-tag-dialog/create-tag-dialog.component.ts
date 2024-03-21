import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TagService } from '../../../assets/wise5/services/tagService';

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
export class CreateTagDialogComponent {
  protected tagName: string = '';

  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    private tagService: TagService
  ) {}

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
