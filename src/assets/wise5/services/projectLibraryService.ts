import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './configService';
import { Observable, map } from 'rxjs';

@Injectable()
export class ProjectLibraryService {
  constructor(protected configService: ConfigService, protected http: HttpClient) {}

  getLibraryProjects(): Observable<any[]> {
    return this.http
      .get<any[]>(this.configService.getConfigParam('getLibraryProjectsURL'))
      .pipe(map((projects) => this.sortAndFilterUniqueProjects(projects)));
  }

  private sortAndFilterUniqueProjects(projects: any): any[] {
    const flatProjectList = projects
      .map((grade) => {
        return grade.children;
      })
      .flat();
    return this.filterUniqueProjects(flatProjectList).sort(this.sortByProjectIdDescending);
  }

  private filterUniqueProjects(projects: any[]): any[] {
    const uniqueProjects = [];
    const foundProjects = new Map();
    for (const project of projects) {
      if (!foundProjects.has(project.id)) {
        foundProjects.set(project.id, project);
        uniqueProjects.push(project);
      }
    }
    return uniqueProjects;
  }

  private sortByProjectIdDescending(project1: any, project2: any): number {
    return project2.id - project1.id;
  }
}
