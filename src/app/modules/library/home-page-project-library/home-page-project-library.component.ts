import { Component } from '@angular/core';
import { LibraryService } from '../../../services/library.service';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';

@Component({
  providers: [ProjectFilterValues],
  selector: 'app-home-page-project-library',
  standalone: false,
  styleUrls: ['./home-page-project-library.component.scss', '../library/library.component.scss'],
  templateUrl: './home-page-project-library.component.html'
})
export class HomePageProjectLibraryComponent {
  constructor(private libraryService: LibraryService) {
    libraryService.getOfficialLibraryProjects();
  }

  ngOnDestroy(): void {
    this.libraryService.clearAll();
  }
}
