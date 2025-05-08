import { BehaviorSubject } from 'rxjs';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { LibraryGroup } from '../libraryGroup';
import { LibraryProject } from '../libraryProject';
import { LibraryComponent } from '../library/library.component';

@Component({
  selector: 'app-official-library',
  templateUrl: './official-library.component.html',
  styleUrls: ['./official-library.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class OfficialLibraryComponent extends LibraryComponent {
  @Input() isSplitScreen: boolean = false;

  projects: LibraryProject[] = [];
  libraryGroups: LibraryGroup[] = [];
  expandedGroups: object = {};

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(
      this.libraryService.libraryGroupsSource$.subscribe((libraryGroups) => {
        this.libraryGroups = libraryGroups;
      })
    );
    this.subscriptions.add(
      this.libraryService.officialLibraryProjectsSource$.subscribe((libraryProjects) => {
        this.projects = libraryProjects;
        this.filterUpdated();
      })
    );
  }

  protected getNumVisiblePersonalOrPublicProjects(): BehaviorSubject<number> {
    return this.libraryService.numberOfPublicProjectsVisible;
  }
}
