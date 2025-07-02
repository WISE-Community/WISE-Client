import { BehaviorSubject } from 'rxjs';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { LibraryGroupThumbsComponent } from '../library-group-thumbs/library-group-thumbs.component';
import { LibraryProjectComponent } from '../library-project/library-project.component';
import { LibraryGroup } from '../libraryGroup';
import { LibraryComponent } from '../library/library.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatExpansionModule, LibraryGroupThumbsComponent, LibraryProjectComponent],
  selector: 'app-official-library',
  styleUrl: './official-library.component.scss',
  templateUrl: './official-library.component.html'
})
export class OfficialLibraryComponent extends LibraryComponent {
  protected expandedGroups: object = {};
  @Input() isSplitScreen: boolean = false;
  protected libraryGroups: LibraryGroup[] = [];

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
