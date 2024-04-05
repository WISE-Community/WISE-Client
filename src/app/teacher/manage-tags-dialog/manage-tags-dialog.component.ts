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
import { MatIconModule } from '@angular/material/icon';
import { TeacherService } from '../teacher.service';
import { Run } from '../../domain/run';

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
    MatIconModule,
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
    private teacherService: TeacherService,
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
    this.subscriptions.add(
      this.projectTagService.tagDeleted$.subscribe((tag: Tag) => {
        this.tags = this.tags.filter((t) => t.id !== tag.id);
        this.snackBar.open($localize`Tag deleted`);
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

  protected delete(tag: Tag): void {
    this.teacherService.getRuns().subscribe((runs) => {
      if (confirm(this.getDeleteMessage(runs, tag))) {
        this.projectTagService.deleteTag(tag);
      }
    });
  }

  private getDeleteMessage(runs: Run[], tag: Tag): string {
    const numberOfProjectsWithTag = this.getNumberOfProjectsWithTag(runs, tag);
    const numberOfProjectsMessage =
      numberOfProjectsWithTag === 1
        ? $localize`There is ${numberOfProjectsWithTag} unit with this tag.`
        : $localize`There are ${numberOfProjectsWithTag} units with this tag.`;
    return $localize`Are you sure you want to delete this tag? ` + numberOfProjectsMessage;
  }

  private getNumberOfProjectsWithTag(runs: Run[], tag: Tag) {
    const projectsWithTag = runs.filter((run: Run) =>
      run.project.tags.some((projectTag: Tag) => projectTag.id === tag.id)
    );
    return projectsWithTag.length;
  }
}
