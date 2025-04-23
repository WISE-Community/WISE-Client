import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
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
  protected communityBuilt: boolean;
  @Input() filterValues: ProjectFilterValues;
  @Output() publicUnitTypeUpdatedEvent: EventEmitter<ProjectFilterValues> =
    new EventEmitter<ProjectFilterValues>();
  protected wiseTested: boolean;

  constructor(private dialog: MatDialog) {}

  protected updatePublicUnitType(): void {
    this.filterValues.publicUnitTypeValue = [];
    if (this.wiseTested) {
      this.filterValues.publicUnitTypeValue.push('wiseTested');
    }
    if (this.communityBuilt) {
      this.filterValues.publicUnitTypeValue.push('communityBuilt');
    }
    this.publicUnitTypeUpdatedEvent.emit(this.filterValues);
  }

  protected showInfo(type: 'community' | 'official'): void {
    this.dialog.open(type === 'community' ? CommunityDetailsComponent : OfficialDetailsComponent, {
      panelClass: 'dialog-sm'
    });
  }
}

@Directive()
abstract class DetailsComponent {
  constructor(public dialogRef: MatDialogRef<DetailsComponent>) {}

  protected close(): void {
    this.dialogRef.close();
  }
}

@Component({
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, RouterLink],
  templateUrl: '../official-library/official-library-details.html'
})
class OfficialDetailsComponent extends DetailsComponent {}

@Component({
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, RouterLink],
  templateUrl: '../community-library/community-library-details.html'
})
class CommunityDetailsComponent extends DetailsComponent {}
