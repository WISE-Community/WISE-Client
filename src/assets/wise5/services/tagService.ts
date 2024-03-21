'use strict';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './configService';
import { map } from 'rxjs/operators';
import { ProjectService } from './projectService';
import { Observable, Subject, Subscription } from 'rxjs';
import { Project } from '../../../app/domain/project';
import { Tag } from '../../../app/domain/tag';

@Injectable()
export class TagService {
  private tagUpdatedSource: Subject<Tag> = new Subject<Tag>();
  public tagUpdated$: Observable<Tag> = this.tagUpdatedSource.asObservable();
  private tags: any[] = [];

  constructor(
    protected http: HttpClient,
    protected ConfigService: ConfigService,
    protected ProjectService: ProjectService
  ) {}

  setTags(tags: any[]) {
    this.tags = tags;
  }

  getTags() {
    return this.tags;
  }

  addTag(id: number, name: string) {
    const tagObject: any = {
      name: name
    };
    if (id != null) {
      tagObject.id = id;
    }
    this.tags.push(tagObject);
  }

  retrieveRunTags() {
    return this.http.get(`/api/tag/run/${this.ConfigService.getRunId()}`).pipe(
      map((data: any) => {
        this.tags = data;
        return data;
      })
    );
  }

  retrieveStudentTags() {
    return this.http.get(`/api/tag/workgroup/${this.ConfigService.getWorkgroupId()}`).pipe(
      map((data: any) => {
        this.tags = data;
        return data;
      })
    );
  }

  getNextAvailableTag() {
    this.getTagsFromProject();
    let counter = 1;
    const tagPrefix = 'Group ';
    const existingTagNames = this.getExistingTagNames();
    while (true) {
      const newTagName = tagPrefix + counter;
      if (!existingTagNames.includes(newTagName)) {
        this.addTag(null, newTagName);
        return newTagName;
      }
      counter++;
    }
  }

  getExistingTagNames() {
    return this.tags.map((tag) => {
      return tag.name;
    });
  }

  getTagsFromProject() {
    this.tags = this.ProjectService.getTags();
  }

  hasTagName(tagName: string): boolean {
    return this.getExistingTagNames().includes(tagName);
  }

  retrieveUserTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`/api/user/tags`);
  }

  applyTagToProjects(tag: Tag, projects: Project[]): Subscription {
    const projectIds = projects.map((project) => project.id);
    return this.http.put(`/api/projects/tag/${tag.text}`, projectIds).subscribe();
  }

  removeTagFromProjects(tag: Tag, projects: Project[]): Subscription {
    let params = new HttpParams();
    for (const project of projects) {
      params = params.append('projectIds', project.id);
    }
    return this.http.delete(`/api/projects/tag/${tag.text}`, { params: params }).subscribe();
  }

  updateTag(tag: Tag): void {
    this.http.put<Tag>(`/api/user/tag/${tag.id}`, tag).subscribe((tag) => {
      this.tagUpdatedSource.next(tag);
    });
  }
}
