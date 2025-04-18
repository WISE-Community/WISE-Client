import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectFilterValues } from '../../../domain/projectFilterValues';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [FormsModule, MatCheckboxModule, MatIconModule],
  selector: 'public-unit-type-selector',
  styles: [
    `
      a {
        cursor: pointer;
      }
    `
  ],
  templateUrl: './public-unit-type-selector.component.html'
})
export class PublicUnitTypeSelectorComponent {
  protected communityBuilt: boolean = false;
  @Input() filterValues: ProjectFilterValues;
  @Output() publicUnitTypeUpdatedEvent: EventEmitter<void> = new EventEmitter<void>();
  protected wiseTested: boolean = false;

  constructor(private dialog: MatDialog) {}

  protected updatePublicUnitType(): void {
    this.filterValues.publicUnitTypeValue = [];
    if (this.wiseTested) {
      this.filterValues.publicUnitTypeValue.push('wiseTested');
    }
    if (this.communityBuilt) {
      this.filterValues.publicUnitTypeValue.push('communityBuilt');
    }
    this.publicUnitTypeUpdatedEvent.emit();
  }

  protected showOfficialLibraryInfo(): void {
    this.dialog.open(OfficialDetailsComponent, {
      panelClass: 'dialog-sm'
    });
  }

  protected showCommunityLibraryInfo(): void {
    this.dialog.open(CommunityDetailsComponent, {
      panelClass: 'dialog-sm'
    });
  }
}

@Component({
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, RouterLink],
  selector: 'official-details',
  templateUrl: '../official-library/official-library-details.html'
})
export class OfficialDetailsComponent {
  constructor(public dialogRef: MatDialogRef<OfficialDetailsComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, RouterLink],
  selector: 'community-details',
  templateUrl: '../community-library/community-library-details.html'
})
export class CommunityDetailsComponent {
  constructor(public dialogRef: MatDialogRef<CommunityDetailsComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
