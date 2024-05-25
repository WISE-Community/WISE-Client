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
  protected branchNodeId: string;
  protected firstNodeIdInBranchPath: string;
  protected libraryProjects: any[];
  protected myProjects: any[];
  protected targetId: string;
  protected targetType: string;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private projectLibraryService: ProjectLibraryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.targetType = history.state.targetType;
    this.targetId = history.state.targetId;
    this.branchNodeId = history.state.branchNodeId;
    this.firstNodeIdInBranchPath = history.state.firstNodeIdInBranchPath;
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
        targetType: this.targetType,
        targetId: this.targetId,
        branchNodeId: this.branchNodeId,
        firstNodeIdInBranchPath: this.firstNodeIdInBranchPath
      }
    });
  }
}
