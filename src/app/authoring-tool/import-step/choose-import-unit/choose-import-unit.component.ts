import { Component } from '@angular/core';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { ProjectLibraryService } from '../../../../assets/wise5/services/projectLibraryService';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddStepTarget } from '../../../domain/addStepTarget';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    RouterModule
  ],
  selector: 'choose-import-unit',
  standalone: true,
  styleUrls: ['./choose-import-unit.component.scss', '../../add-content.scss'],
  templateUrl: './choose-import-unit.component.html'
})
export class ChooseImportUnitComponent {
  private importType: 'step' | 'component';
  protected libraryProjects: any[];
  protected myProjects: any[];
  private subscriptions: Subscription = new Subscription();
  protected target: AddStepTarget;

  constructor(
    private configService: ConfigService,
    private projectLibraryService: ProjectLibraryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.importType = history.state.importType;
    this.target = history.state;
    this.myProjects = this.configService.getAuthorableProjects();
    this.subscriptions.add(
      this.projectLibraryService
        .getLibraryProjects()
        .subscribe((libraryProjects) => (this.libraryProjects = libraryProjects))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected chooseProject(project: any): void {
    this.target.importProjectId = project.id;
    this.router.navigate(
      [this.importType === 'component' ? '../choose-component' : '../choose-step'],
      {
        relativeTo: this.route,
        state: this.target
      }
    );
  }

  protected goBack(): void {
    this.router.navigate([this.importType === 'component' ? '../..' : '../../choose-template'], {
      relativeTo: this.route,
      state: this.target
    });
  }

  protected cancel(): void {
    this.router.navigate([this.importType === 'component' ? '../..' : '../../..'], {
      relativeTo: this.route,
      state: this.target
    });
  }
}
