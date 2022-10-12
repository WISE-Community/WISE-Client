import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { ProjectService } from '../../../services/projectService';
import { UtilService } from '../../../services/utilService';
import { AuthorPeerGroupingDialogComponent } from '../author-peer-grouping-dialog/author-peer-grouping-dialog.component';
import { DIFFERENT_IDEAS_REGEX, DIFFERENT_IDEAS_VALUE } from '../PeerGroupingLogic';

@Component({
  selector: 'edit-peer-grouping-dialog',
  templateUrl: './edit-peer-grouping-dialog.component.html',
  styleUrls: ['./edit-peer-grouping-dialog.component.scss']
})
export class EditPeerGroupingDialogComponent extends AuthorPeerGroupingDialogComponent {
  allowedReferenceComponentTypes: string[] = ['OpenResponse'];
  logicType: string;
  referenceComponent: any = {};
  stepsUsedIn: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public peerGrouping: PeerGrouping,
    protected dialogRef: MatDialogRef<EditPeerGroupingDialogComponent>,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService,
    private projectService: ProjectService,
    private utilService: UtilService
  ) {
    super(dialogRef);
  }

  ngOnInit(): void {
    this.peerGrouping = this.utilService.makeCopyOfJSONObject(this.peerGrouping);
    this.stepsUsedIn = this.peerGroupingAuthoringService.getStepsUsedIn(this.peerGrouping.tag);
    this.logicType = this.getLogicType(this.peerGrouping.logic);
    if (this.logicType === DIFFERENT_IDEAS_VALUE) {
      this.referenceComponent = this.getDifferentIdeasReferenceComponent(this.peerGrouping.logic);
    }
  }

  private getLogicType(logic: string): string {
    if (new RegExp(DIFFERENT_IDEAS_REGEX).exec(logic) != null) {
      return DIFFERENT_IDEAS_VALUE;
    } else {
      return logic;
    }
  }

  private getDifferentIdeasReferenceComponent(logic: string): any {
    const result = new RegExp(DIFFERENT_IDEAS_REGEX).exec(logic);
    return {
      nodeId: result[1],
      componentId: result[2]
    };
  }

  referenceComponentNodeIdChanged(event: any): void {
    let numAllowedComponents = 0;
    let allowedComponent = null;
    for (const component of this.projectService.getComponentsByNodeId(event.nodeId)) {
      if (this.allowedReferenceComponentTypes.includes(component.type)) {
        numAllowedComponents += 1;
        allowedComponent = component;
      }
    }
    if (numAllowedComponents === 1) {
      this.referenceComponent.componentId = allowedComponent.id;
    } else {
      this.referenceComponent.componentId = null;
    }
  }

  save(): void {
    this.injectPeerGroupingLogic(this.peerGrouping);
    this.peerGroupingAuthoringService.updatePeerGrouping(this.peerGrouping).subscribe(() => {
      this.dialogRef.close();
    });
  }

  private injectPeerGroupingLogic(peerGrouping: PeerGrouping): void {
    if (this.logicType === DIFFERENT_IDEAS_VALUE) {
      peerGrouping.logic = this.generateDifferentIdeasLogic();
    } else {
      peerGrouping.logic = this.logicType;
    }
  }

  private generateDifferentIdeasLogic(): string {
    return `${DIFFERENT_IDEAS_VALUE}("${this.referenceComponent.nodeId}", "${this.referenceComponent.componentId}")`;
  }

  delete(): void {
    if (confirm($localize`Are you sure you want to delete this Peer Grouping?`)) {
      this.dialogRef.close(true);
    }
  }
}
