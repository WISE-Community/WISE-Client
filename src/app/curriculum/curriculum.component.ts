import { Component } from '@angular/core';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PersonalLibraryComponent } from '../modules/library/personal-library/personal-library.component';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';

@Component({
  imports: [
    LibraryFiltersComponent,
    MatIconModule,
    MatTabsModule,
    PersonalLibraryComponent,
    PublicLibraryComponent
  ],
  styleUrl: './curriculum.component.scss',
  templateUrl: './curriculum.component.html'
})
export class CurriculumComponent {}
