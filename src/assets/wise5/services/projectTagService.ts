import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { Project } from '../../../app/domain/project';
import { Tag } from '../../../app/domain/tag';

@Injectable()
export class ProjectTagService {
  private newTagSource: Subject<Tag> = new Subject<Tag>();
  public newTag$: Observable<Tag> = this.newTagSource.asObservable();
  private tagDeletedSource: Subject<Tag> = new Subject<Tag>();
  public tagDeleted$: Observable<Tag> = this.tagDeletedSource.asObservable();
  private tagUpdatedSource: Subject<Tag> = new Subject<Tag>();
  public tagUpdated$: Observable<Tag> = this.tagUpdatedSource.asObservable();

  constructor(protected http: HttpClient) {}

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

  createTag(tagName: string): Subscription {
    return this.http.post(`/api/user/tag`, { text: tagName }).subscribe((tag: Tag) => {
      this.newTagSource.next(tag);
    });
  }

  sortTags(tags: Tag[]): Tag[] {
    return tags.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
  }

  deleteTag(tag: Tag): void {
    this.http.delete(`/api/user/tag/${tag.id}`).subscribe((tag: Tag) => {
      this.tagDeletedSource.next(tag);
    });
  }
}
