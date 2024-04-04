import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser';
import { TeacherRun } from '../teacher-run';
import { ConfigService } from '../../services/config.service';
import { flash } from '../../animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ShareRunCodeDialogComponent } from '../share-run-code-dialog/share-run-code-dialog.component';
import { Subscription } from 'rxjs';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { Tag } from '../../domain/tag';

@Component({
  selector: 'app-teacher-run-list-item',
  templateUrl: './teacher-run-list-item.component.html',
  styleUrls: ['./teacher-run-list-item.component.scss'],
  animations: [flash]
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
    private sanitizer: DomSanitizer,
    private configService: ConfigService,
    private router: Router,
    private elRef: ElementRef,
    private dialog: MatDialog,
    private projectTagService: ProjectTagService
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
  }

  subscribeToTagUpdated(): void {
    this.subscriptions.add(
      this.projectTagService.tagUpdated$.subscribe((tagThatChanged: Tag) => {
        const tagOnProject = this.run.project.tags.find((tag: Tag) => tag.id === tagThatChanged.id);
        if (tagOnProject != null) {
          tagOnProject.text = tagThatChanged.text;
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

  private getThumbStyle() {
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

  shareCode(event: Event): void {
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
