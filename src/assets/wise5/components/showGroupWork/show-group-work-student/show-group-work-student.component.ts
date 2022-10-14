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
  isPeerGroupRetrieved: boolean = false;
  narrowComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  peerGroup: PeerGroup;
  showWorkComponentContent: any;
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
    this.retrieveStudentWorkForPeerGroup();
    this.setShowWorkComponentContent();
  }

  private retrieveStudentWorkForPeerGroup(): void {
    this.peerGroupService
      .retrievePeerGroup(this.componentContent.peerGroupingTag, this.workgroupId)
      .subscribe((peerGroup: PeerGroup) => {
        if (peerGroup != null) {
          this.peerGroup = this.componentContent.isShowMyWork
            ? peerGroup
            : this.removeMyWorkgroup(peerGroup);
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
        }
        this.isPeerGroupRetrieved = true;
      });
  }

  setStudentWorkFromGroupMembers(studentWorkFromGroupMembers: any[]): void {
    studentWorkFromGroupMembers.forEach((work) => {
      this.workgroupIdToWork.set(work.workgroupId, work);
    });
  }

  private setShowWorkComponentContent(): void {
    this.showWorkComponentContent = this.projectService.injectAssetPaths(
      this.projectService.getComponent(
        this.componentContent.showWorkNodeId,
        this.componentContent.showWorkComponentId
      )
    );
  }

  private removeMyWorkgroup(peerGroup: PeerGroup): PeerGroup {
    const myWorkgroupId = this.configService.getWorkgroupId();
    peerGroup.members = peerGroup.members.filter((workgroup) => {
      return workgroup.id !== myWorkgroupId;
    });
    return peerGroup;
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
