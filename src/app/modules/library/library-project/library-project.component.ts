import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter, inject } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LibraryProject } from '../libraryProject';
import { LibraryProjectDetailsComponent } from '../library-project-details/library-project-details.component';
import { flash } from '../../../animations';
import { ProjectSelectionEvent } from '../../../domain/projectSelectionEvent';
import { Subscription } from 'rxjs';
import { ProjectTagService } from '../../../../assets/wise5/services/projectTagService';
import { Tag } from '../../../domain/tag';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LibraryProjectDisciplinesComponent } from '../library-project-disciplines/library-project-disciplines.component';
import { MatIconModule } from '@angular/material/icon';
import { UnitTagsComponent } from '../../../teacher/unit-tags/unit-tags.component';
import { FormsModule } from '@angular/forms';

@Component({
  animations: [flash],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    LibraryProjectDisciplinesComponent,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    UnitTagsComponent
  ],
  selector: 'app-library-project',
  styleUrl: './library-project.component.scss',
  templateUrl: './library-project.component.html'
})
export class LibraryProjectComponent implements OnInit {
  private dialog = inject(MatDialog);
  private projectTagService = inject(ProjectTagService);
  private sanitizer = inject(DomSanitizer);

  protected animateDelay: string = '0s';
  protected animateDuration: string = '0s';
  @Input() checked: boolean = false;
  @Input() myUnit: boolean = false;
  @Input() project: LibraryProject = new LibraryProject();
  @Output() projectSelectionEvent: EventEmitter<ProjectSelectionEvent> =
    new EventEmitter<ProjectSelectionEvent>();
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.project.thumbStyle = this.getThumbStyle(this.project.projectThumb);
    if (this.project.isHighlighted) {
      this.animateDuration = '2s';
      this.animateDelay = '1s';
      setTimeout(() => {
        this.project.isHighlighted = false;
      }, 7000);
    }
    this.subscribeToTagUpdated();
    this.subscribeToTagDeleted();
  }

  private subscribeToTagUpdated(): void {
    this.subscriptions.add(
      this.projectTagService.tagUpdated$.subscribe((updatedTag: Tag) => {
        const projectTag = this.project.tags.find((tag: Tag) => tag.id === updatedTag.id);
        if (projectTag != null) {
          projectTag.text = updatedTag.text;
          projectTag.color = updatedTag.color;
          this.projectTagService.sortTags(this.project.tags);
        }
      })
    );
  }

  private subscribeToTagDeleted(): void {
    this.subscriptions.add(
      this.projectTagService.tagDeleted$.subscribe((tag: Tag) => {
        if (this.project.hasTag(tag)) {
          this.project.removeTag(tag);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Returns the background-image css value for project thumbnail
   * @param {string} projectThumb
   * @returns {SafeStyle}
   */
  private getThumbStyle(projectThumb: string): SafeStyle {
    const DEFAULT_THUMB = 'assets/img/default-picture-sm.svg';
    const STYLE = `url(${projectThumb}), url(${DEFAULT_THUMB})`;
    return this.sanitizer.bypassSecurityTrustStyle(STYLE);
  }

  protected showDetails(): void {
    this.dialog.open(LibraryProjectDetailsComponent, {
      ariaLabel: $localize`Unit Details`,
      data: { project: this.project },
      panelClass: 'dialog-md'
    });
  }

  protected selectProject(event: any): void {
    this.project.selected = event.target.checked;
    event.stopPropagation();
    this.projectSelectionEvent.emit({ selected: event.target.checked, project: this.project });
  }
}
