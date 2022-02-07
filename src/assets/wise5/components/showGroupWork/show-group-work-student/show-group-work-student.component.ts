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
import { PeerGroup } from '../../peerChat/PeerGroup';

@Component({
  selector: 'show-group-work-student',
  templateUrl: './show-group-work-student.component.html',
  styleUrls: ['./show-group-work-student.component.scss']
})
export class ShowGroupWorkStudentComponent extends ComponentStudent {
  flexLayout: string = 'column';
  narrowComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  peerGroup: PeerGroup = new PeerGroup();
  showWorkComponentContent: any;
  showWorkNodeId: string;
  studentWorkFromGroupMembers: any[];
  widthLg: number = 100;
  widthMd: number = 100;
  workgroupIdToWork = new Map();
  workgroupInfos: any = {};

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
        this.peerGroup = peerGroup;
        this.setWorkgroupInfos();
        this.peerGroupService
          .retrieveStudentWork(
            peerGroup,
            this.nodeId,
            this.componentId,
            this.componentContent.showWorkNodeId,
            this.componentContent.showWorkComponentId
          )
          .subscribe((studentWorkFromGroupMembers: any[]) => {
            this.setStudentWorkFromGroupMembers(studentWorkFromGroupMembers);
            this.setLayout();
          });
      });
    this.showWorkComponentContent = this.projectService.getComponentByNodeIdAndComponentId(
      this.componentContent.showWorkNodeId,
      this.componentContent.showWorkComponentId
    );
    this.showWorkComponentContent = this.projectService.injectAssetPaths(
      this.showWorkComponentContent
    );
    this.showWorkNodeId = this.componentContent.showWorkNodeId;
  }

  setStudentWorkFromGroupMembers(studentWorkFromGroupMembers: any[]): void {
    this.studentWorkFromGroupMembers = this.componentContent.isShowMyWork
      ? studentWorkFromGroupMembers
      : this.removeMyWork(studentWorkFromGroupMembers);
    this.studentWorkFromGroupMembers.forEach((work) => {
      this.workgroupIdToWork.set(work.workgroupId, work);
    });
  }

  private removeMyWork(studentWorkList: any[]): any[] {
    const myWorkgroupId = this.configService.getWorkgroupId();
    return studentWorkList.filter((studentWork) => {
      return studentWork.workgroupId !== myWorkgroupId;
    });
  }

  setWorkgroupInfos(): void {
    this.workgroupInfos = {};
    for (const member of this.peerGroup.members) {
      this.setWorkgroupInfo(member.id);
    }
  }

  private setWorkgroupInfo(workgroupId: number): void {
    this.workgroupInfos[workgroupId] = {
      avatarColor: this.ConfigService.getAvatarColorForWorkgroupId(workgroupId),
      displayNames: this.ConfigService.getUsernamesStringByWorkgroupId(workgroupId)
    };
  }

  setLayout(): void {
    if (this.componentContent.layout === 'row') {
      this.flexLayout = 'row wrap';
      this.setWidths();
    }
  }
  setWidths(): void {
    const numWorkgroups = this.peerGroup.members.length;
    if (numWorkgroups > 1) {
      this.widthMd = 50;
      this.widthLg = 50;
    }
    if (numWorkgroups > 2 && this.isNarrow()) {
      this.widthLg = 33.33;
    }
  }

  isNarrow(): boolean {
    return this.narrowComponentTypes.includes(this.showWorkComponentContent.type);
  }
}
