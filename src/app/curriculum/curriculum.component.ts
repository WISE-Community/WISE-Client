import { Component } from '@angular/core';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'curriculum',
  imports: [LibraryFiltersComponent, MatIconModule, PublicLibraryComponent],
  templateUrl: './curriculum.component.html',
  styleUrl: './curriculum.component.scss'
})
export class CurriculumComponent {}
