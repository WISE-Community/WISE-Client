import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../domain/project';
import { TagService } from '../../../assets/wise5/services/tagService';

@Component({
  selector: 'apply-tags-button',
  templateUrl: './apply-tags-button.component.html',
  styleUrls: ['./apply-tags-button.component.scss']
})
export class ApplyTagsButtonComponent implements OnInit {
  protected tags: any[] = [];
  @Input() selectedProjects: Project[] = [];

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tagService.retrieveUserTags().subscribe((tags) => {
      for (const tag of tags) {
        tag.checked = this.doesAnyProjectHaveTag(tag);
      }
      this.tags = tags;
    });
  }

  private doesAnyProjectHaveTag(tag: any): boolean {
    for (const project of this.selectedProjects) {
      if (project.tags.includes(tag.text)) {
        return true;
      }
    }
    return false;
  }

  protected toggleTagOnProjects(tag: any, checked: boolean): void {
    if (checked) {
      this.addTagToProjects(tag, this.selectedProjects);
      this.tagService.applyTagToProjects(tag.text, this.selectedProjects);
    } else {
      this.removeTagFromProjects(tag, this.selectedProjects);
      this.tagService.removeTagFromProjects(tag.text, this.selectedProjects);
    }
  }

  private addTagToProjects(tag: any, projects: Project[]): void {
    for (const project of projects) {
      project.tags.push(tag.text);
      project.tags.sort();
    }
  }

  private removeTagFromProjects(tag: any, projects: Project[]): void {
    for (const project of projects) {
      project.tags = project.tags.filter((projectTag: string) => projectTag !== tag.text);
      project.tags.sort();
    }
  }
}
