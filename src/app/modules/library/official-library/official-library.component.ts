import { Component, Input, ViewEncapsulation, Inject } from '@angular/core';
import { LibraryGroup } from '../libraryGroup';
import { LibraryProject } from '../libraryProject';
import { LibraryService } from '../../../services/library.service';
import { LibraryComponent } from '../library/library.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-official-library',
  templateUrl: './official-library.component.html',
  styleUrls: ['./official-library.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OfficialLibraryComponent extends LibraryComponent {
  @Input() isSplitScreen: boolean = false;

  projects: LibraryProject[] = [];
  libraryGroups: LibraryGroup[] = [];
  expandedGroups: object = {};

  constructor(protected dialog: MatDialog, protected libraryService: LibraryService) {
    super(dialog, libraryService);
  }

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

  emitNumberOfProjectsVisible(numProjectsVisible: number = null) {
    if (numProjectsVisible) {
      this.libraryService.numberOfOfficialProjectsVisible.next(numProjectsVisible);
    } else {
      this.libraryService.numberOfOfficialProjectsVisible.next(this.filteredProjects.length);
    }
  }

  protected getDetailsComponent(): any {
    return OfficialLibraryDetailsComponent;
  }
}

@Component({
  selector: 'official-library-details',
  templateUrl: 'official-library-details.html'
})
export class OfficialLibraryDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<OfficialLibraryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
