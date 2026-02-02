import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { SelectStepAndComponentComponent } from '../../../../../app/authoring-tool/select-step-and-component/select-step-and-component.component';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { AuthorPeerGroupingDialogComponent } from '../author-peer-grouping-dialog/author-peer-grouping-dialog.component';

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
  protected override dialogRef = inject(MatDialogRef<CreateNewPeerGroupingDialogComponent>);
  private peerGroupingAuthoringService = inject(PeerGroupingAuthoringService);

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
