import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibraryProjectComponent } from './library-project/library-project.component';
import { LibraryProjectDetailsComponent } from './library-project-details/library-project-details.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LibraryFiltersComponent } from './library-filters/library-filters.component';
import { HomePageProjectLibraryComponent } from './home-page-project-library/home-page-project-library.component';
import { OfficialLibraryComponent } from './official-library/official-library.component';
import { PersonalLibraryComponent } from './personal-library/personal-library.component';
import { ShareProjectDialogComponent } from './share-project-dialog/share-project-dialog.component';
import { LibraryPaginatorIntl } from './libraryPaginatorIntl';
import { ArchiveProjectsButtonComponent } from '../../teacher/archive-projects-button/archive-projects-button.component';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { SelectAllItemsCheckboxComponent } from './select-all-items-checkbox/select-all-items-checkbox.component';
import { ApplyTagsButtonComponent } from '../../teacher/apply-tags-button/apply-tags-button.component';
import { SelectTagsComponent } from '../../teacher/select-tags/select-tags.component';
import { MatChipsModule } from '@angular/material/chips';
import { SelectMenuComponent } from '../shared/select-menu/select-menu.component';
import { UnitTagsComponent } from '../../teacher/unit-tags/unit-tags.component';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { StandardsSelectMenuComponent } from '../shared/standards-select-menu/standards-select-menu.component';
import { CurriculumComponent } from '../../curriculum/curriculum.component';
import { ColorService } from '../../../assets/wise5/services/colorService';

const materialModules = [
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatMenuModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
];

@NgModule({
  imports: [
    ApplyTagsButtonComponent,
    ArchiveProjectsButtonComponent,
    CommonModule,
    CurriculumComponent,
    FormsModule,
    LibraryFiltersComponent,
    LibraryProjectComponent,
    LibraryProjectDetailsComponent,
    OfficialLibraryComponent,
    PersonalLibraryComponent,
    ReactiveFormsModule,
    RouterModule,
    materialModules,
    StandardsSelectMenuComponent,
    SearchBarComponent,
    SelectAllItemsCheckboxComponent,
    SelectMenuComponent,
    SelectTagsComponent,
    SharedModule,
    UnitTagsComponent,
    HomePageProjectLibraryComponent,
    ShareProjectDialogComponent
  ],
  exports: [
    CurriculumComponent,
    HomePageProjectLibraryComponent,
    PersonalLibraryComponent,
    ReactiveFormsModule,
    UnitTagsComponent,
    materialModules
  ],
  providers: [
    ColorService,
    { provide: MatPaginatorIntl, useClass: LibraryPaginatorIntl },
    ProjectTagService
  ]
})
export class LibraryModule {}
