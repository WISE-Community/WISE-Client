import { Component } from '@angular/core';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';

@Component({
  selector: 'curriculum',
  imports: [LibraryFiltersComponent, PublicLibraryComponent],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss'
})
export class CurriculumComponent {}
