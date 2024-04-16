import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../domain/project';
import { Tag } from '../../domain/tag';
import { MatDialog } from '@angular/material/dialog';
import { ManageTagsDialogComponent } from '../manage-tags-dialog/manage-tags-dialog.component';
import { Subscription } from 'rxjs';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

@Component({
  selector: 'apply-tags-button',
  templateUrl: './apply-tags-button.component.html',
  styleUrls: ['./apply-tags-button.component.scss'],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }]
})
export class ApplyTagsButtonComponent implements OnInit {
  @Input() selectedProjects: Project[] = [];
  private subscriptions: Subscription = new Subscription();
  protected tags: Tag[] = [];

  constructor(private dialog: MatDialog, private projectTagService: ProjectTagService) {}

  ngOnInit(): void {
    this.subscribeToTagUpdated();
    this.subscribeToNewTag();
    this.subscribeToTagDeleted();
  }

  ngOnChanges(): void {
    this.retrieveUserTags();
  }

  private retrieveUserTags(): void {
    this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
      for (const tag of tags) {
        this.updateTagCheckedValue(tag);
      }
      this.tags = tags;
    });
  }

  private updateTagCheckedValue(tag: Tag): void {
    const numProjectsWithTag = this.getNumProjectsWithTag(tag);
    tag.checked = numProjectsWithTag === this.selectedProjects.length;
    tag.indeterminateChecked =
      numProjectsWithTag > 0 && numProjectsWithTag < this.selectedProjects.length;
  }

  private getNumProjectsWithTag(tag: Tag): number {
    return this.selectedProjects.filter((project) =>
      project.tags.some((projectTag) => projectTag.id === tag.id)
    ).length;
  }

  private subscribeToTagUpdated(): void {
    this.subscriptions.add(
      this.projectTagService.tagUpdated$.subscribe((tagThatChanged: Tag) => {
        const tag = this.tags.find((t: Tag) => t.id === tagThatChanged.id);
        tag.text = tagThatChanged.text;
        tag.color = tagThatChanged.color;
        this.projectTagService.sortTags(this.tags);
      })
    );
  }

  private subscribeToNewTag(): void {
    this.subscriptions.add(
      this.projectTagService.newTag$.subscribe((tag: Tag) => {
        this.tags.push(tag);
        this.projectTagService.sortTags(this.tags);
      })
    );
  }

  private subscribeToTagDeleted(): void {
    this.subscriptions.add(
      this.projectTagService.tagDeleted$.subscribe((deletedTag: Tag) => {
        this.tags = this.tags.filter((tag: Tag) => tag.id !== deletedTag.id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected toggleTagOnProjects(tag: Tag): void {
    if (tag.checked || tag.indeterminateChecked) {
      this.projectTagService.removeTagFromProjects(tag, this.selectedProjects).subscribe(() => {
        this.removeTagFromProjects(tag, this.selectedProjects);
        this.updateTagCheckedValue(tag);
      });
    } else {
      this.projectTagService.applyTagToProjects(tag, this.selectedProjects).subscribe(() => {
        this.addTagToProjects(tag, this.selectedProjects);
        this.updateTagCheckedValue(tag);
      });
    }
  }

  private addTagToProjects(tag: Tag, projects: Project[]): void {
    for (const project of projects) {
      project.addTag(tag);
    }
  }

  private removeTagFromProjects(tag: Tag, projects: Project[]): void {
    for (const project of projects) {
      project.tags = project.tags.filter((projectTag: Tag) => projectTag.id !== tag.id);
    }
  }

  protected manageTags(): void {
    this.dialog.open(ManageTagsDialogComponent, {
      panelClass: 'dialog-md'
    });
  }
}
