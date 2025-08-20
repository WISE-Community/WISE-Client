import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { LibraryFiltersComponent } from '../modules/library/library-filters/library-filters.component';
import { LibraryService } from '../services/library.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PersonalLibraryComponent } from '../modules/library/personal-library/personal-library.component';
import { PublicLibraryComponent } from '../modules/library/public-library/public-library.component';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ProjectFilterValues } from '../domain/projectFilterValues';

@Component({
  imports: [
    LibraryFiltersComponent,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    PersonalLibraryComponent,
    PublicLibraryComponent,
    RouterModule
  ],
  providers: [ProjectFilterValues],
  styleUrl: './curriculum.component.scss',
  templateUrl: './curriculum.component.html'
})
export class CurriculumComponent {
  private numMyUnitsVisible: number = 0;
  private numPublicUnitsVisible: number = 0;
  protected showMyUnits: boolean;
  private subscriptions: Subscription = new Subscription();

  constructor(
    protected configService: ConfigService,
    private libraryService: LibraryService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showMyUnits = this.userService.isTeacher();
    this.getLibraryProjects();
    this.subscribeNumUnitsVisible();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getLibraryProjects(): void {
    this.libraryService.getCommunityLibraryProjects();
    this.libraryService.getOfficialLibraryProjects();
    if (this.showMyUnits) {
      this.libraryService.getPersonalLibraryProjects();
      this.libraryService.getSharedLibraryProjects();
    }
  }

  private subscribeNumUnitsVisible(): void {
    this.subscriptions.add(
      this.libraryService.numberOfPersonalProjectsVisible$.subscribe(
        (num) => (this.numMyUnitsVisible = num)
      )
    );
    this.subscriptions.add(
      this.libraryService.numberOfPublicProjectsVisible$.subscribe(
        (num) => (this.numPublicUnitsVisible = num)
      )
    );
  }

  protected getPublicTabLabel(): string {
    return $localize`Public (${this.numPublicUnitsVisible})`;
  }

  protected getMyUnitsTabLabel(): string {
    return $localize`My Units (${this.numMyUnitsVisible})`;
  }

  protected isPublicRoute(): boolean {
    return this.router.url === '/curriculum/public';
  }

  protected isPersonalRoute(): boolean {
    return this.router.url === '/curriculum/personal';
  }
}
