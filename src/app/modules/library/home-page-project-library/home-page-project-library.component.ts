import { Component } from '@angular/core';
import { LibraryService } from '../../../services/library.service';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

@Component({
  selector: 'app-home-page-project-library',
  styleUrls: ['./home-page-project-library.component.scss', '../library/library.component.scss'],
  templateUrl: './home-page-project-library.component.html',
  standalone: false
})
export class HomePageProjectLibraryComponent {
  protected filterValues: ProjectFilterValues = new ProjectFilterValues();

  constructor(private libraryService: LibraryService) {
    libraryService.getOfficialLibraryProjects();
  }

  ngOnDestroy() {
    this.libraryService.clearAll();
  }
}
