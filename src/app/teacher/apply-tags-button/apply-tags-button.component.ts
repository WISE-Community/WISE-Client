import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../domain/project';
import { Tag } from '../../domain/tag';
import { MatDialog } from '@angular/material/dialog';
import { ManageTagsDialogComponent } from '../manage-tags-dialog/manage-tags-dialog.component';
import { Subscription } from 'rxjs';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';

@Component({
  selector: 'apply-tags-button',
  templateUrl: './apply-tags-button.component.html',
  styleUrls: ['./apply-tags-button.component.scss']
})
export class ApplyTagsButtonComponent implements OnInit {
  @Input() selectedProjects: Project[] = [];
  private subscriptions: Subscription = new Subscription();
  protected tags: Tag[] = [];

  constructor(private dialog: MatDialog, private projectTagService: ProjectTagService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.projectTagService.retrieveUserTags().subscribe((tags: Tag[]) => {
        for (const tag of tags) {
          tag.checked = this.doesAnyProjectHaveTag(tag);
        }
        this.tags = tags;
      })
    );
    this.subscriptions.add(
      this.projectTagService.tagUpdated$.subscribe((tagThatChanged: Tag) => {
        const tag = this.tags.find((t: Tag) => t.id === tagThatChanged.id);
        tag.text = tagThatChanged.text;
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

  private doesAnyProjectHaveTag(tag: Tag): boolean {
    for (const project of this.selectedProjects) {
      if (project.tags.some((projectTag) => projectTag.id === tag.id)) {
        return true;
      }
    }
    return false;
  }

  protected toggleTagOnProjects(tag: Tag, addTag: boolean): void {
    if (addTag) {
      this.addTagToProjects(tag, this.selectedProjects);
      this.projectTagService.applyTagToProjects(tag, this.selectedProjects);
    } else {
      this.removeTagFromProjects(tag, this.selectedProjects);
      this.projectTagService.removeTagFromProjects(tag, this.selectedProjects);
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
