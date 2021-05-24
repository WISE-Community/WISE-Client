import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { unique } from 'jquery';
import { ConfigService } from './configService';

@Injectable()
export class ProjectLibraryService {
  constructor(protected http: HttpClient, protected ConfigService: ConfigService) {}

  getLibraryProjects() {
    return this.http
      .get(this.ConfigService.getConfigParam('getLibraryProjectsURL'))
      .toPromise()
      .then((projects) => {
        return projects;
      });
  }

  sortAndFilterUniqueProjects(projects: any) {
    const flatProjectList = projects
      .map((grade) => {
        return grade.children;
      })
      .flat();
    return this.filterUniqueProjects(flatProjectList).sort(this.sortByProjectIdDescending);
  }

  filterUniqueProjects(projects: any[]): any[] {
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

  sortByProjectIdDescending(project1: any, project2: any) {
    return project2.id - project1.id;
  }
}
