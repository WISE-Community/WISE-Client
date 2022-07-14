import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-project-library',
  templateUrl: './teacher-project-library.component.html',
  styleUrls: ['./teacher-project-library.component.scss', '../library/library.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TeacherProjectLibraryComponent implements OnInit {
  projects: LibraryProject[] = [];
  numberOfOfficialProjectsVisible: number = 0;
  numberOfCommunityProjectsVisible: number = 0;
  numberOfPersonalProjectsVisible: number = 0;
  route: String;
  tabs: any[] = [
    { path: 'tested', label: $localize`WISE Tested`, numVisible: 0 },
    { path: 'community', label: $localize`Community Built`, numVisible: 0 },
    { path: 'personal', label: $localize`My Units`, numVisible: 0 }
  ];

  constructor(private libraryService: LibraryService, private router: Router) {}

  ngOnInit() {
    this.libraryService.numberOfOfficialProjectsVisible$.subscribe((num) => {
      this.tabs[0].numVisible = num;
    });
    this.libraryService.numberOfCommunityProjectsVisible$.subscribe((num) => {
      this.tabs[1].numVisible = num;
    });
    this.libraryService.numberOfPersonalProjectsVisible$.subscribe((num) => {
      this.tabs[2].numVisible = num;
    });
    this.libraryService.getCommunityLibraryProjects();
    this.libraryService.getOfficialLibraryProjects();
    this.libraryService.getPersonalLibraryProjects();
    this.libraryService.getSharedLibraryProjects();
    this.libraryService.newProjectSource$.subscribe((project) => {
      if (project) {
        document.querySelector('.library').scrollIntoView();
      }
    });
  }

  isOfficialRoute(): boolean {
    return this.router.url === '/teacher/home/library/tested';
  }

  isCommunityRoute(): boolean {
    return this.router.url === '/teacher/home/library/community';
  }

  isPersonalRoute(): boolean {
    return this.router.url === '/teacher/home/library/personal';
  }
}
