import { Component, OnInit } from '@angular/core';
import { Tag } from '../../domain/tag';
import { Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { MatIconModule } from '@angular/material/icon';
import { TeacherService } from '../teacher.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditTagComponent } from '../edit-tag/edit-tag.component';
import { Project } from '../../domain/project';

@Component({
  imports: [
    CommonModule,
    EditTagComponent,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  selector: 'manage-tags-dialog',
  standalone: true,
  styleUrl: './manage-tags-dialog.component.scss',
  templateUrl: './manage-tags-dialog.component.html'
})
export class ManageTagsDialogComponent implements OnInit {
  protected idToEditing: { [id: string]: boolean } = {};
  protected inputChanged: Subject<any> = new Subject<any>();
  private projects: Project[];
  protected showCreateTag: boolean;
  private subscriptions: Subscription = new Subscription();
  protected tags: Tag[] = [];

  constructor(
    private projectTagService: ProjectTagService,
    private snackBar: MatSnackBar,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.teacherService.getPersonalAndSharedProjects().subscribe((projects) => {
      this.projects = projects;
    });
    this.subscriptions.add(
      this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
        this.tags = tags;
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

  protected cancelEditing(tag: Tag): void {
    this.idToEditing[tag.id] = false;
  }

  protected delete(tag: Tag): void {
    if (confirm(this.getDeleteMessage(tag))) {
      this.projectTagService.deleteTag(tag).subscribe((tag: Tag) => {
        this.tags = this.tags.filter((t) => t.id !== tag.id);
        this.snackBar.open($localize`Tag deleted`);
      });
    }
  }

  private getDeleteMessage(tag: Tag): string {
    const numProjectsWithTag = this.projects.filter((project: Project) =>
      project.tags.some((projectTag: Tag) => projectTag.id === tag.id)
    ).length;
    const numberOfProjectsMessage =
      numProjectsWithTag === 1
        ? $localize`There is ${numProjectsWithTag} unit with this tag.`
        : $localize`There are ${numProjectsWithTag} units with this tag.`;
    return $localize`Are you sure you want to delete this tag? ` + numberOfProjectsMessage;
  }
}
