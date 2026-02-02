import { Component, inject } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { LibraryService } from '../../../services/library.service';
import { ShareItemDialogComponent } from '../share-item-dialog/share-item-dialog.component';
import { Project } from '../../../domain/project';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDivider } from '@angular/material/divider';
import {
  MatFormField,
  MatLabel,
  MatPrefix,
  MatSuffix,
  MatHint
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { MatIconButton, MatButton } from '@angular/material/button';
import { NgClass, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-share-project-dialog',
  styleUrl: './share-project-dialog.component.scss',
  templateUrl: './share-project-dialog.component.html',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDivider,
    MatFormField,
    MatLabel,
    MatIcon,
    MatPrefix,
    MatInput,
    FormsModule,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatIconButton,
    MatSuffix,
    NgClass,
    MatHint,
    MatAutocomplete,
    MatOption,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    RouterLink,
    MatCheckbox,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    AsyncPipe
  ]
})
export class ShareProjectDialogComponent extends ShareItemDialogComponent {
  dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any[]>();
  displayedColumns: string[] = ['name', 'permissions'];
  duplicate: boolean = false;
  public libraryService = inject(LibraryService);

  ngOnInit(): void {
    super.ngOnInit();
    this.project = this.data.project;
    this.projectId = this.data.project.id;
    this.libraryService.getProjectInfo(this.projectId).subscribe((project: Project) => {
      this.project = project;
      this.populateSharedOwners(project.sharedOwners);
    });
    this.getSharedOwners().subscribe((sharedOwners) => {
      let owners = [...sharedOwners];
      owners.reverse();
      if (this.project.owner) {
        owners.unshift({
          sharedOwner: this.project.owner,
          isOwner: true
        });
      }
      this.dataSource = new MatTableDataSource(owners);
    });
  }

  populatePermissions(sharedOwner) {
    this.addProjectPermissions(sharedOwner);
  }

  setDefaultProjectPermissions(sharedOwner) {
    sharedOwner.projectPermissions = {
      1: true, // View the project
      2: false, // Edit the project
      16: false // Admin (read, write, share)
    };
  }

  shareProject() {
    this.duplicate = false;
    const sharedOwnerUsername = this.teacherSearchControl.value;
    if (
      this.project.owner.username !== sharedOwnerUsername &&
      !this.isSharedOwner(sharedOwnerUsername)
    ) {
      this.teacherService
        .addSharedProjectOwner(this.project.id, sharedOwnerUsername)
        .subscribe((newSharedOwner) => {
          if (newSharedOwner != null) {
            this.setDefaultProjectPermissions(newSharedOwner);
            this.addSharedOwner(newSharedOwner);
            this.teacherSearchControl.setValue('');
          }
        });
    } else {
      this.duplicate = true;
    }
    document.getElementById('share-project-dialog-search').blur();
  }

  unshareProject(sharedOwner) {
    this.teacherService
      .removeSharedProjectOwner(this.project.id, sharedOwner.username)
      .subscribe((response) => {
        this.removeSharedOwner(sharedOwner);
      });
  }
}
