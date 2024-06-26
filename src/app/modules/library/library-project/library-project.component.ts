import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { LibraryProject } from '../libraryProject';
import { LibraryProjectDetailsComponent } from '../library-project-details/library-project-details.component';
import { flash } from '../../../animations';
import { ProjectSelectionEvent } from '../../../domain/projectSelectionEvent';
import { Subscription } from 'rxjs';
import { ProjectTagService } from '../../../../assets/wise5/services/projectTagService';
import { Tag } from '../../../domain/tag';

@Component({
  animations: [flash],
  encapsulation: ViewEncapsulation.None,
  selector: 'app-library-project',
  styleUrl: './library-project.component.scss',
  templateUrl: './library-project.component.html'
})
export class LibraryProjectComponent implements OnInit {
  animateDelay: string = '0s';
  animateDuration: string = '0s';
  @Input() checked: boolean = false;
  @Input() myUnit: boolean = false;
  @Input() project: LibraryProject = new LibraryProject();
  @Output()
  projectSelectionEvent: EventEmitter<ProjectSelectionEvent> = new EventEmitter<ProjectSelectionEvent>();
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private projectTagService: ProjectTagService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
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
      this.projectTagService.tagUpdated$.subscribe((tagThatChanged: Tag) => {
        const tagOnProject = this.project.tags.find((tag: Tag) => tag.id === tagThatChanged.id);
        if (tagOnProject != null) {
          tagOnProject.text = tagThatChanged.text;
          tagOnProject.color = tagThatChanged.color;
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
