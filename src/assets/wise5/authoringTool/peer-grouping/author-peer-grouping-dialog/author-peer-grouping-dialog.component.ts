import { Directive, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { ReferenceComponent } from '../../../../../app/domain/referenceComponent';
import { ProjectService } from '../../../services/projectService';
import { AVAILABLE_LOGIC, AVAILABLE_MODES, PeerGroupingLogic } from '../PeerGroupingLogic';

@Directive()
export abstract class AuthorPeerGroupingDialogComponent implements OnInit {
  allowedReferenceComponentTypes: string[] = ['OpenResponse'];
  availableLogic: PeerGroupingLogic[];
  logicType: string;
  logicTypesWithModes: string[] = ['differentIdeas', 'differentKIScores'];
  mode: string;
  availableModes: any[] = AVAILABLE_MODES;
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
    if (this.logicTypesWithModes.includes(this.logicType)) {
      this.peerGrouping.logic = this.generateLogicString(
        this.logicType,
        this.referenceComponent,
        this.mode
      );
    } else {
      this.peerGrouping.logic = this.logicType;
    }
  }

  private generateLogicString(
    logicType: string,
    referenceComponent: ReferenceComponent,
    mode: string
  ): string {
    if (mode == null) {
      return `${logicType}("${referenceComponent.nodeId}", "${referenceComponent.componentId}")`;
    } else {
      return `${logicType}("${referenceComponent.nodeId}", "${referenceComponent.componentId}", "${mode}")`;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
