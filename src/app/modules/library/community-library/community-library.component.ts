import { Component, Inject } from '@angular/core';
import { LibraryService } from '../../../services/library.service';
import { LibraryProject } from '../libraryProject';
import { LibraryComponent } from '../library/library.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-community-library',
  templateUrl: './community-library.component.html',
  styleUrls: ['./community-library.component.scss']
})
export class CommunityLibraryComponent extends LibraryComponent {
  projects: LibraryProject[] = [];
  filteredProjects: LibraryProject[] = [];

  constructor(protected dialog: MatDialog, protected libraryService: LibraryService) {
    super(dialog, libraryService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(
      this.libraryService.communityLibraryProjectsSource$.subscribe((communityProjects) => {
        this.projects = communityProjects;
        this.filterUpdated();
      })
    );
  }

  emitNumberOfProjectsVisible(numProjectsVisible: number = null) {
    if (numProjectsVisible) {
      this.libraryService.numberOfCommunityProjectsVisible.next(numProjectsVisible);
    } else {
      this.libraryService.numberOfCommunityProjectsVisible.next(this.filteredProjects.length);
    }
  }

  protected getDetailsComponent(): any {
    return CommunityLibraryDetailsComponent;
  }
}

@Component({
  selector: 'community-library-details',
  templateUrl: 'community-library-details.html'
})
export class CommunityLibraryDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<CommunityLibraryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
