import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LibraryGroup } from '../modules/library/libraryGroup';
import { LibraryProject } from '../modules/library/libraryProject';
import { Project } from '../domain/project';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private libraryGroupsUrl = '/api/project/library';
  private communityProjectsUrl = '/api/project/community';
  private personalProjectsUrl = '/api/project/personal';
  private sharedProjectsUrl = '/api/project/shared';
  private copyProjectUrl = '/api/project/copy';
  private projectInfoUrl = '/api/project/info';
  public libraryGroups: LibraryGroup[];
  private libraryGroupsSource = new BehaviorSubject<LibraryGroup[]>([]);
  public libraryGroupsSource$ = this.libraryGroupsSource.asObservable();
  private officialLibraryProjectsSource = new BehaviorSubject<LibraryProject[]>([]);
  public officialLibraryProjectsSource$ = this.officialLibraryProjectsSource.asObservable();
  private communityLibraryProjectsSource = new BehaviorSubject<LibraryProject[]>([]);
  public communityLibraryProjectsSource$ = this.communityLibraryProjectsSource.asObservable();
  private personalLibraryProjectsSource = new Subject<LibraryProject[]>();
  public personalLibraryProjectsSource$ = this.personalLibraryProjectsSource.asObservable();
  private sharedLibraryProjectsSource = new Subject<LibraryProject[]>();
  public sharedLibraryProjectsSource$ = this.sharedLibraryProjectsSource.asObservable();
  private newProjectSource = new BehaviorSubject<LibraryProject>(null);
  public newProjectSource$ = this.newProjectSource.asObservable();
  public numberOfPublicProjectsVisible = new BehaviorSubject<number>(0);
  public numberOfPublicProjectsVisible$ = this.numberOfPublicProjectsVisible.asObservable();
  public numberOfPersonalProjectsVisible = new BehaviorSubject<number>(0);
  public numberOfPersonalProjectsVisible$ = this.numberOfPersonalProjectsVisible.asObservable();

  getOfficialLibraryProjects(): void {
    this.http.get<LibraryGroup[]>(this.libraryGroupsUrl).subscribe((libraryGroups) => {
      const projects: LibraryProject[] = [];
      this.libraryGroups = this.convertLibraryGroups(libraryGroups);
      for (let group of this.libraryGroups) {
        this.populateProjects(group, projects);
      }
      projects.forEach((project) => (project.metadata.publicUnitType = 'wiseTested'));
      this.officialLibraryProjectsSource.next(projects);
      this.libraryGroupsSource.next(this.libraryGroups);
    });
  }

  convertLibraryGroups(libraryGroups: LibraryGroup[]) {
    const convertedLibraryGroups: LibraryGroup[] = [];
    for (let libraryGroup of libraryGroups) {
      convertedLibraryGroups.push(this.convertLibraryGroup(libraryGroup));
    }
    return convertedLibraryGroups;
  }

  convertLibraryGroup(libraryObj: any) {
    if (libraryObj.type === 'project') {
      return new LibraryProject(libraryObj);
    } else if (libraryObj.type === 'group') {
      const children = libraryObj.children;
      const convertedLibraryGroup = [];
      for (let child of children) {
        convertedLibraryGroup.push(this.convertLibraryGroup(child));
      }
      libraryObj.children = convertedLibraryGroup;
      return libraryObj;
    }
  }

  getCommunityLibraryProjects(): void {
    this.http.get<LibraryProject[]>(this.communityProjectsUrl).subscribe((projects) => {
      const communityProjects: LibraryProject[] = this.convertToLibraryProjects(projects);
      communityProjects.forEach((project) => (project.metadata.publicUnitType = 'communityBuilt'));
      this.communityLibraryProjectsSource.next(communityProjects);
    });
  }

  getPersonalLibraryProjects() {
    this.http.get<LibraryProject[]>(this.personalProjectsUrl).subscribe((projects) => {
      const personalLibraryProjects: LibraryProject[] = this.convertToLibraryProjects(projects);
      this.personalLibraryProjectsSource.next(personalLibraryProjects);
    });
  }

  getSharedLibraryProjects() {
    this.http.get<LibraryProject[]>(this.sharedProjectsUrl).subscribe((projects) => {
      const sharedLibraryProjects: LibraryProject[] = this.convertToLibraryProjects(projects);
      for (let sharedLibraryProject of sharedLibraryProjects) {
        sharedLibraryProject.shared = true;
      }
      this.sharedLibraryProjectsSource.next(sharedLibraryProjects);
    });
  }

  convertToLibraryProjects(projectsJSON) {
    const libraryProjects: LibraryProject[] = [];
    for (let project of projectsJSON) {
      const libraryProject = new LibraryProject(project);
      libraryProjects.push(libraryProject);
    }
    return libraryProjects;
  }

  populateProjects(item: any, projects: LibraryProject[]): void {
    if (item.type === 'project') {
      item.visible = true;
      projects.push(item);
    } else if (item.type === 'group') {
      let children = item.children;
      for (let child of children) {
        this.populateProjects(child, projects);
      }
    }
  }

  copyProject(projectId) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let body = new HttpParams();
    body = body.set('projectId', projectId + '');
    return this.http.post(this.copyProjectUrl, body, { headers: headers });
  }

  addPersonalLibraryProject(project: LibraryProject) {
    this.newProjectSource.next(project);
    this.router.navigate(['/curriculum/personal'], { state: { newProjectId: project.id } });
  }

  getProjectInfo(projectId): Observable<Project> {
    return this.http.get<Project>(this.projectInfoUrl + '/' + projectId);
  }

  updateNumberOfPublicProjectsVisible(count) {
    this.numberOfPublicProjectsVisible.next(count);
  }

  updateNumberOfPersonalProjectsVisible(count) {
    this.numberOfPersonalProjectsVisible.next(count);
  }

  clearAll(): void {
    this.libraryGroupsSource.next([]);
    this.officialLibraryProjectsSource.next([]);
    this.communityLibraryProjectsSource.next([]);
    this.personalLibraryProjectsSource.next([]);
    this.sharedLibraryProjectsSource.next([]);
  }
}
