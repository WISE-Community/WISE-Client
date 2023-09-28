import { Directive, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { ReferenceComponent } from '../../../../../app/domain/referenceComponent';
import { ProjectService } from '../../../services/projectService';
import { AVAILABLE_LOGIC, AVAILABLE_MODES, PeerGroupingLogic } from '../PeerGroupingLogic';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    protected projectService: ProjectService,
    protected snackBar: MatSnackBar
  ) {
    this.availableLogic = AVAILABLE_LOGIC;
  }

  ngOnInit(): void {}

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

  protected handleError(error: any): void {
    switch (error.messageCode) {
      case 'genericError':
        this.snackBar.open($localize`An error occurred. Please try again.`);
        break;
      case 'notAuthorized':
        this.snackBar.open($localize`You are not allowed to perform this action.`);
        break;
    }
  }
}
