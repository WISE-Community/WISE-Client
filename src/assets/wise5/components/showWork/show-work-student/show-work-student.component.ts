import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';

@Component({
  selector: 'show-work-student',
  templateUrl: './show-work-student.component.html',
  styleUrls: ['./show-work-student.component.scss']
})
export class ShowWorkStudentComponent extends ComponentStudent {
  showWorkComponentContent: any;

  studentWork: any;

  constructor(
    protected annotationService: AnnotationService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    protected projectService: ProjectService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService,
    protected upgrade: UpgradeModule,
    protected utilService: UtilService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService,
      upgrade,
      utilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showWorkComponentContent = this.projectService.getComponentByNodeIdAndComponentId(
      this.componentContent.showWorkNodeId,
      this.componentContent.showWorkComponentId
    );
    this.studentWork = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.componentContent.showWorkNodeId,
      this.componentContent.showWorkComponentId
    );
  }
}
