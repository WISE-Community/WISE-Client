import { Component, inject } from '@angular/core';
import { LibraryService } from '../../../services/library.service';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { LibraryFiltersComponent } from '../library-filters/library-filters.component';
import { RouterLink } from '@angular/router';
import { OfficialLibraryComponent } from '../official-library/official-library.component';

@Component({
  imports: [LibraryFiltersComponent, RouterLink, OfficialLibraryComponent],
  providers: [ProjectFilterValues],
  selector: 'app-home-page-project-library',
  styleUrls: ['./home-page-project-library.component.scss', '../library/library.component.scss'],
  templateUrl: './home-page-project-library.component.html'
})
export class HomePageProjectLibraryComponent {
  private libraryService = inject(LibraryService);

  ngOnInit(): void {
    this.libraryService.getOfficialLibraryProjects();
  }

  ngOnDestroy(): void {
    this.libraryService.clearAll();
  }
}
