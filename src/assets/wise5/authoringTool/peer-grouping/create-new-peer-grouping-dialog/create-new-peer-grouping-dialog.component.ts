import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { AuthorPeerGroupingDialogComponent } from '../author-peer-grouping-dialog/author-peer-grouping-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../services/projectService';
import { SelectStepAndComponentComponent } from '../../../../../app/authoring-tool/select-step-and-component/select-step-and-component.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SelectStepAndComponentComponent
  ],
  selector: 'create-new-peer-grouping-dialog',
  templateUrl: './create-new-peer-grouping-dialog.component.html'
})
export class CreateNewPeerGroupingDialogComponent extends AuthorPeerGroupingDialogComponent {
  constructor(
    protected dialogRef: MatDialogRef<CreateNewPeerGroupingDialogComponent>,
    private peerGroupingAuthoringService: PeerGroupingAuthoringService,
    protected projectService: ProjectService,
    protected snackBar: MatSnackBar
  ) {
    super(dialogRef, projectService, snackBar);
  }

  ngOnInit(): void {
    this.peerGrouping = new PeerGrouping({ logic: 'random', maxMembershipCount: 2 });
  }

  create(): Subscription {
    this.peerGrouping.tag = this.peerGroupingAuthoringService.getUniqueTag();
    this.updatePeerGroupingLogic();
    return this.peerGroupingAuthoringService.createNewPeerGrouping(this.peerGrouping).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: ({ error }) => {
        this.handleError(error);
      }
    });
  }
}
