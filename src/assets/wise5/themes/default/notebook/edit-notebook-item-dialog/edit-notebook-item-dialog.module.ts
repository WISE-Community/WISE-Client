import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragAndDropModule } from '../../../../common/drag-and-drop/drag-and-drop.module';
import { EditNotebookItemDialogComponent } from './edit-notebook-item-dialog.component';
import { WiseLinkComponent } from '../../../../directives/wise-link/wise-link.component';

@NgModule({
  declarations: [EditNotebookItemDialogComponent],
  imports: [
    CommonModule,
    DragAndDropModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule,
    WiseLinkComponent
  ],
  exports: [EditNotebookItemDialogComponent]
})
export class EditNotebookItemDialogModule {}
