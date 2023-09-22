import { Component } from '@angular/core';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { ProjectLibraryService } from '../../../../assets/wise5/services/projectLibraryService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'choose-import-unit',
  styleUrls: ['./choose-import-unit.component.scss'],
  templateUrl: './choose-import-unit.component.html'
})
export class ChooseImportUnitComponent {
  protected libraryProjects: any[];
  protected myProjects: any[];

  constructor(
    private configService: ConfigService,
    private projectLibraryService: ProjectLibraryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.myProjects = this.configService.getAuthorableProjects();
    this.projectLibraryService.getLibraryProjects().then((libraryProjects) => {
      this.libraryProjects = this.projectLibraryService.sortAndFilterUniqueProjects(
        libraryProjects
      );
    });
  }

  protected chooseProject(project: any): void {
    this.router.navigate(['../choose-step'], {
      relativeTo: this.route,
      state: { importProjectId: project.id }
    });
  }
}
