import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { flash } from '../../animations';
import { MatDialog } from '@angular/material/dialog';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { Router } from '@angular/router';
import { SafeStyle } from '@angular/platform-browser';
import { ShareRunCodeDialogComponent } from '../share-run-code-dialog/share-run-code-dialog.component';
import { Subscription } from 'rxjs';
import { Tag } from '../../domain/tag';
import { TeacherRun } from '../teacher-run';
import { UnitTagsComponent } from '../unit-tags/unit-tags.component';
import { RunMenuComponent } from '../run-menu/run-menu.component';
import { ConfigService } from '../../services/config.service';

@Component({
  animations: [flash],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    RunMenuComponent,
    UnitTagsComponent
  ],
  selector: 'app-teacher-run-list-item',
  styleUrl: './teacher-run-list-item.component.scss',
  templateUrl: './teacher-run-list-item.component.html'
})
export class TeacherRunListItemComponent implements OnInit {
  protected animateDelay: string = '0s';
  protected animateDuration: string = '0s';
  protected manageStudentsLink: string = '';
  protected periodsTooltipText: string;
  @Input() run: TeacherRun = new TeacherRun();
  @Output() runArchiveStatusChangedEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() runSelectedStatusChangedEvent: EventEmitter<void> = new EventEmitter<void>();
  private subscriptions: Subscription = new Subscription();
  protected thumbStyle: SafeStyle;

  constructor(
    private configService: ConfigService,
    private dialog: MatDialog,
    private elRef: ElementRef,
    private projectTagService: ProjectTagService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.run.project.thumbStyle = this.getThumbStyle();
    this.manageStudentsLink = `${this.configService.getContextPath()}/teacher/manage/unit/${
      this.run.id
    }/manage-students`;
    if (this.run.highlighted) {
      this.animateDuration = '2s';
      this.animateDelay = '1s';
      setTimeout(() => {
        this.run.highlighted = false;
      }, 7000);
    }
    this.subscribeToTagUpdated();
    this.subscribeToTagDeleted();
  }

  private subscribeToTagUpdated(): void {
    this.subscriptions.add(
      this.projectTagService.tagUpdated$.subscribe((updatedTag: Tag) => {
        const projectTag = this.run.project.tags.find((tag: Tag) => tag.id === updatedTag.id);
        if (projectTag != null) {
          projectTag.text = updatedTag.text;
          projectTag.color = updatedTag.color;
          this.projectTagService.sortTags(this.run.project.tags);
        }
      })
    );
  }

  private subscribeToTagDeleted(): void {
    this.subscriptions.add(
      this.projectTagService.tagDeleted$.subscribe((tag: Tag) => {
        if (this.run.project.hasTag(tag)) {
          this.run.project.removeTag(tag);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.run.highlighted) {
      this.elRef.nativeElement.querySelector('mat-card').scrollIntoView();
    }
  }

  ngOnChanges(): void {
    this.periodsTooltipText = this.getPeriodsTooltipText();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getThumbStyle(): SafeStyle {
    const DEFAULT_THUMB = 'assets/img/default-picture.svg';
    const STYLE = `url(${this.run.project.projectThumb}), url(${DEFAULT_THUMB})`;
    return this.sanitizer.bypassSecurityTrustStyle(STYLE);
  }

  protected launchGradeAndManageTool(): void {
    if (this.run.project.wiseVersion === 4) {
      window.location.href =
        `${this.configService.getWISE4Hostname()}` +
        `/teacher/classroomMonitor/classroomMonitor?runId=${this.run.id}&gradingType=monitor`;
    } else {
      this.router.navigateByUrl(
        `${this.configService.getContextPath()}/teacher/manage/unit/${this.run.id}`
      );
    }
  }

  private getPeriodsTooltipText(): string {
    let string = '';
    const length = this.run.periods.length;
    for (let p = 0; p < length; p++) {
      if (p === 0) {
        string = $localize`Class Periods:` + ' ';
      }
      string += this.run.periods[p];
      if (p < length - 1) {
        string += ', ';
      }
    }
    return string;
  }

  protected isRunActive(run: TeacherRun): boolean {
    return run.isActive(this.configService.getCurrentServerTime());
  }

  protected isRunCompleted(run: TeacherRun): boolean {
    return run.isCompleted(this.configService.getCurrentServerTime());
  }

  protected shareCode(event: Event): void {
    event.preventDefault();
    this.dialog.open(ShareRunCodeDialogComponent, {
      data: this.run,
      panelClass: 'dialog-sm'
    });
  }

  protected runArchiveStatusChanged(): void {
    this.run.project.selected = false;
    this.runSelectedStatusChangedEvent.emit();
    this.runArchiveStatusChangedEvent.emit();
  }
}
