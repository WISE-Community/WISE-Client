import { Component } from '@angular/core';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { ProjectLibraryService } from '../../../../assets/wise5/services/projectLibraryService';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddStepTarget } from '../../../domain/addStepTarget';

@Component({
  selector: 'choose-import-unit',
  styleUrls: ['./choose-import-unit.component.scss', '../../add-content.scss'],
  templateUrl: './choose-import-unit.component.html'
})
export class ChooseImportUnitComponent {
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
    this.target = history.state.target;
    this.myProjects = this.configService.getAuthorableProjects();
    this.subscriptions.add(
      this.projectLibraryService.getLibraryProjects().subscribe((libraryProjects) => {
        this.libraryProjects = libraryProjects;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected chooseProject(project: any): void {
    this.router.navigate(['../choose-step'], {
      relativeTo: this.route,
      state: {
        importProjectId: project.id,
        target: this.target
      }
    });
  }
}
