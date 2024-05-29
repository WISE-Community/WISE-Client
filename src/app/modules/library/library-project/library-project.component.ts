import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { LibraryProject } from '../libraryProject';
import { LibraryProjectDetailsComponent } from '../library-project-details/library-project-details.component';
import { flash } from '../../../animations';
import { ProjectSelectionEvent } from '../../../domain/projectSelectionEvent';

@Component({
  animations: [flash],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-library-project',
  styleUrl: './library-project.component.scss',
  templateUrl: './library-project.component.html'
})
export class LibraryProjectComponent implements OnInit {
  @Input() checked: boolean = false;
  @Input() myUnit: boolean = false;
  @Input() project: LibraryProject = new LibraryProject();
  @Output()
  projectSelectionEvent: EventEmitter<ProjectSelectionEvent> = new EventEmitter<ProjectSelectionEvent>();

  animateDuration: string = '0s';
  animateDelay: string = '0s';

  constructor(public dialog: MatDialog, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.project.thumbStyle = this.getThumbStyle(this.project.projectThumb);
    if (this.project.isHighlighted) {
      this.animateDuration = '2s';
      this.animateDelay = '1s';
      setTimeout(() => {
        this.project.isHighlighted = false;
      }, 7000);
    }
  }

  /**
   * Returns the background-image css value for project thumbnail
   * @param {string} projectThumb
   * @returns {SafeStyle}
   */
  getThumbStyle(projectThumb: string) {
    const DEFAULT_THUMB = 'assets/img/default-picture-sm.svg';
    const STYLE = `url(${projectThumb}), url(${DEFAULT_THUMB})`;
    return this.sanitizer.bypassSecurityTrustStyle(STYLE);
  }

  showDetails(): void {
    const project = this.project;
    this.dialog.open(LibraryProjectDetailsComponent, {
      ariaLabel: $localize`Unit Details`,
      data: { project: project },
      panelClass: 'dialog-md'
    });
  }

  protected selectProject(event: any): void {
    this.project.selected = event.target.checked;
    event.stopPropagation();
    this.projectSelectionEvent.emit({ selected: event.target.checked, project: this.project });
  }
}
