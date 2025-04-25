import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PersonalLibraryComponent } from '../modules/library/personal-library/personal-library.component';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';
import { LibraryService } from '../services/library.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

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
export class CurriculumComponent {
  protected showMyUnits: boolean;
  private numMyUnitsVisible: number = 0;
  private numPublicUnitsVisible: number = 0;

  constructor(
    protected configService: ConfigService,
    private libraryService: LibraryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.setShowMyUnits();
    this.getLibraryProjects();
    this.subscribeNumUnitsVisible();
  }

  private setShowMyUnits(): void {
    this.userService.getUser().subscribe((user) => {
      this.showMyUnits = user.roles && user.roles.includes('teacher');
    });
  }

  private getLibraryProjects(): void {
    this.libraryService.getCommunityLibraryProjects();
    this.libraryService.getOfficialLibraryProjects();
    if (this.showMyUnits) {
      this.libraryService.getPersonalLibraryProjects();
      this.libraryService.getSharedLibraryProjects();
    }
  }

  private subscribeNumUnitsVisible() {
    this.libraryService.numberOfPersonalProjectsVisible$.subscribe(
      (num) => (this.numMyUnitsVisible = num)
    );
    this.libraryService.numberOfPublicProjectsVisible$.subscribe(
      (num) => (this.numPublicUnitsVisible = num)
    );
  }

  protected getPublicTabLabel(): string {
    return `Public (${this.numPublicUnitsVisible})`;
  }

  protected getMyUnitsTabLabel(): string {
    return `My Units (${this.numMyUnitsVisible})`;
  }
}
