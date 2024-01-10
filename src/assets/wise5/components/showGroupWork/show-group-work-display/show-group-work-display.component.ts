import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { PeerGroupService } from '../../../services/peerGroupService';
import { ProjectService } from '../../../services/projectService';
import { PeerGroup } from '../../peerChat/PeerGroup';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';

@Component({
  selector: 'show-group-work-display',
  templateUrl: './show-group-work-display.component.html',
  styleUrls: ['./show-group-work-display.component.scss']
})
export class ShowGroupWorkDisplayComponent implements OnInit {
  @Input() componentContent: any;
  @Input() componentId: string;
  flexLayout: string = 'column';
  isPeerGroupRetrieved: boolean = false;
  narrowComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  @Input() nodeId: string;
  peerGroup: PeerGroup;
  showWorkComponentContent: any;
  widthLg: number = 100;
  widthMd: number = 100;
  @Input() workgroupId: number;
  workgroupIdToWork = new Map<number, any>();
  workgroupInfos: any = {};

  constructor(
    private configService: ConfigService,
    private peerGroupService: PeerGroupService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
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
      avatarColor: getAvatarColorForWorkgroupId(workgroupId),
      displayNames: this.configService.getUsernamesStringByWorkgroupId(workgroupId)
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

  private isNarrow(): boolean {
    return this.narrowComponentTypes.includes(this.showWorkComponentContent.type);
  }
}
