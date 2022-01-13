import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';

@Component({
  selector: 'show-group-work-student',
  templateUrl: './show-group-work-student.component.html',
  styleUrls: ['./show-group-work-student.component.scss']
})
export class ShowGroupWorkStudentComponent extends ComponentStudent {
  showWorkComponentContent: any;
  showWorkNodeId: string;
  studentWorkFromGroupMembers: any[];

  constructor(
    protected annotationService: AnnotationService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    protected peerGroupService: PeerGroupService,
    protected projectService: ProjectService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService,
    protected utilService: UtilService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService,
      utilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.peerGroupService
      .retrievePeerGroup(this.componentContent.peerGroupActivityTag)
      .subscribe((peerGroup) => {
        this.peerGroupService
          .retrieveStudentWork(
            peerGroup,
            this.nodeId,
            this.componentId,
            this.componentContent.showWorkNodeId,
            this.componentContent.showWorkComponentId
          )
          .subscribe((studentWorkFromGroupMembers: any[]) => {
            this.studentWorkFromGroupMembers = studentWorkFromGroupMembers;
          });
      });
    this.showWorkComponentContent = this.projectService.getComponentByNodeIdAndComponentId(
      this.componentContent.showWorkNodeId,
      this.componentContent.showWorkComponentId
    );
    this.showWorkNodeId = this.componentContent.showWorkNodeId;
  }
}
