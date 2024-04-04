import { Component, OnInit } from '@angular/core';
import { Tag } from '../../domain/tag';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateTagDialogComponent } from '../create-tag-dialog/create-tag-dialog.component';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';

@Component({
  selector: 'manage-tags-dialog',
  templateUrl: './manage-tags-dialog.component.html',
  styleUrls: ['./manage-tags-dialog.component.scss'],
  standalone: true,
  imports: [
    CreateTagDialogComponent,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ManageTagsDialogComponent implements OnInit {
  protected inputChanged: Subject<any> = new Subject<any>();
  private subscriptions: Subscription = new Subscription();
  protected tags: Tag[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private projectTagService: ProjectTagService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
        this.tags = tags;
      })
    );
    this.subscriptions.add(
      this.inputChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(({ tag }: any) => {
          this.projectTagService.updateTag(tag);
          this.snackBar.open($localize`Tag updated`);
        })
    );
    this.subscriptions.add(
      this.projectTagService.newTag$.subscribe((tag: Tag) => {
        this.tags.push(tag);
        this.projectTagService.sortTags(this.tags);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected openCreateTagDialog(): void {
    this.dialog.open(CreateTagDialogComponent, {
      panelClass: 'dialog-md'
    });
  }
}
