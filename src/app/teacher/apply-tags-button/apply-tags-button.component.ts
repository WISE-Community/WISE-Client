import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../domain/project';
import { TagService } from '../../../assets/wise5/services/tagService';
import { Tag } from '../../domain/tag';

@Component({
  selector: 'apply-tags-button',
  templateUrl: './apply-tags-button.component.html',
  styleUrls: ['./apply-tags-button.component.scss']
})
export class ApplyTagsButtonComponent implements OnInit {
  @Input() selectedProjects: Project[] = [];
  protected tags: Tag[] = [];

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tagService.retrieveUserTags().subscribe((tags: Tag[]) => {
      for (const tag of tags) {
        tag.checked = this.doesAnyProjectHaveTag(tag);
      }
      this.tags = tags;
    });
  }

  private doesAnyProjectHaveTag(tag: Tag): boolean {
    for (const project of this.selectedProjects) {
      if (project.tags.includes(tag.text)) {
        return true;
      }
    }
    return false;
  }

  protected toggleTagOnProjects(tag: Tag, addTag: boolean): void {
    if (addTag) {
      this.addTagToProjects(tag, this.selectedProjects);
      this.tagService.applyTagToProjects(tag, this.selectedProjects);
    } else {
      this.removeTagFromProjects(tag, this.selectedProjects);
      this.tagService.removeTagFromProjects(tag, this.selectedProjects);
    }
  }

  private addTagToProjects(tag: Tag, projects: Project[]): void {
    for (const project of projects) {
      project.tags.push(tag.text);
      project.tags.sort();
    }
  }

  private removeTagFromProjects(tag: Tag, projects: Project[]): void {
    for (const project of projects) {
      project.tags = project.tags.filter((projectTag: string) => projectTag !== tag.text);
      project.tags.sort();
    }
  }
}
