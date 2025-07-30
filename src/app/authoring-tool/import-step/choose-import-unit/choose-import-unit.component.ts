import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { ProjectLibraryService } from '../../../../assets/wise5/services/projectLibraryService';
import { AddStepTarget } from '../../../domain/addStepTarget';

@Component({
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatTabsModule, RouterModule],
  selector: 'choose-import-unit',
  styleUrls: ['./choose-import-unit.component.scss', '../../add-content.scss'],
  templateUrl: './choose-import-unit.component.html'
})
export class ChooseImportUnitComponent {
  protected importType: 'step' | 'component';
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
    this.navigate('../choose-component', '../choose-step');
  }

  protected goBack(): void {
    this.navigate('../..', '../../choose-template');
  }

  protected cancel(): void {
    this.navigate('../..', '../../..');
  }

  private navigate(componentUrl: string, stepUrl: string): void {
    this.router.navigate([this.importType === 'component' ? componentUrl : stepUrl], {
      relativeTo: this.route,
      state: this.target
    });
  }
}
