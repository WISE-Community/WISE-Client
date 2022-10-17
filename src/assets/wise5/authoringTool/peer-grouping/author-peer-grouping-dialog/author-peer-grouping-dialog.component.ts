import { Directive, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { ReferenceComponent } from '../../../../../app/domain/referenceComponent';
import { ProjectService } from '../../../services/projectService';
import { AVAILABLE_LOGIC, DIFFERENT_IDEAS_VALUE, PeerGroupingLogic } from '../PeerGroupingLogic';

@Directive()
export abstract class AuthorPeerGroupingDialogComponent implements OnInit {
  allowedReferenceComponentTypes: string[] = ['OpenResponse'];
  availableLogic: PeerGroupingLogic[];
  logicType: string;
  peerGrouping: PeerGrouping;
  referenceComponent: ReferenceComponent = new ReferenceComponent(null, null);

  constructor(
    protected dialogRef: MatDialogRef<AuthorPeerGroupingDialogComponent>,
    protected projectService: ProjectService
  ) {
    this.availableLogic = AVAILABLE_LOGIC;
  }

  ngOnInit(): void {}

  referenceComponentNodeIdChanged(event: any): void {
    let numAllowedComponents = 0;
    let allowedComponent = null;
    for (const component of this.projectService.getComponents(event.nodeId)) {
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

  protected updatePeerGroupingLogic(): void {
    this.peerGrouping.logic =
      this.logicType === DIFFERENT_IDEAS_VALUE
        ? `${DIFFERENT_IDEAS_VALUE}("${this.referenceComponent.nodeId}", "${this.referenceComponent.componentId}")`
        : this.logicType;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
