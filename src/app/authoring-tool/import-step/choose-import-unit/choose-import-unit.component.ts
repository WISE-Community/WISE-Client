import { Component } from '@angular/core';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { ProjectLibraryService } from '../../../../assets/wise5/services/projectLibraryService';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'choose-import-unit',
  styleUrls: ['./choose-import-unit.component.scss', '../../add-content.scss'],
  templateUrl: './choose-import-unit.component.html'
})
export class ChooseImportUnitComponent {
  protected libraryProjects: any[];
  protected myProjects: any[];
  protected targetLocation: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private projectLibraryService: ProjectLibraryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.targetLocation = history.state.targetLocation;
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
        targetLocation: this.targetLocation
      }
    });
  }
}
