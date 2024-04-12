import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { Project } from '../../../app/domain/project';
import { Tag } from '../../../app/domain/tag';
import { ProjectAndTagsResponse } from '../../../app/domain/projectAndTagsResponse';

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

  applyTagToProjects(tag: Tag, projects: Project[]): Observable<ProjectAndTagsResponse[]> {
    const projectIds = projects.map((project) => project.id);
    return this.http.put<ProjectAndTagsResponse[]>(`/api/projects/tag/${tag.id}`, projectIds);
  }

  removeTagFromProjects(tag: Tag, projects: Project[]): Observable<ProjectAndTagsResponse[]> {
    let params = new HttpParams();
    for (const project of projects) {
      params = params.append('projectIds', project.id);
    }
    return this.http.delete<ProjectAndTagsResponse[]>(`/api/projects/tag/${tag.id}`, {
      params: params
    });
  }

  updateTag(tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(`/api/user/tag/${tag.id}`, tag).pipe(
      tap((tag) => {
        this.tagUpdatedSource.next(tag);
      })
    );
  }

  createTag(tagName: string, color: string): Observable<Tag> {
    return this.http.post(`/api/user/tag`, { text: tagName, color: color }).pipe(
      tap((tag: Tag) => {
        this.newTagSource.next(tag);
      })
    );
  }

  sortTags(tags: Tag[]): Tag[] {
    return tags.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
  }

  deleteTag(tag: Tag): Observable<Tag> {
    return this.http.delete(`/api/user/tag/${tag.id}`).pipe(
      tap((tag: Tag) => {
        this.tagDeletedSource.next(tag);
      })
    );
  }
}
