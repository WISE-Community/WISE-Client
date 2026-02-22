import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { SaveTimeMessageComponent } from '../../../assets/wise5/common/save-time-message/save-time-message.component';
import {
  insertWiseLinks,
  replaceWiseLinks
} from '../../../assets/wise5/common/wise-link/wise-link';
import { WiseTinymceEditorComponent } from '../../../assets/wise5/directives/wise-tinymce-editor/wise-tinymce-editor.component';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { NotebookParentComponent } from '../notebook-parent/notebook-parent.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NotebookNotesComponent } from '../notebook-notes/notebook-notes.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    SaveTimeMessageComponent,
    WiseTinymceEditorComponent
  ],
  selector: 'notebook-report',
  styleUrl: 'notebook-report.component.scss',
  templateUrl: 'notebook-report.component.html'
})
export class NotebookReportComponent extends NotebookParentComponent {
  private autoSaveIntervalMS: number = 30000;
  private autoSaveIntervalId: any;
  protected collapsed: boolean = true;
  protected dirty: boolean = false;
  protected full: boolean = false;
  protected isAddNoteButtonAvailable: boolean;
  protected hasReport: boolean = false;
  protected reportId: number;
  protected reportItem: any;
  protected reportItemContent: any;
  protected saveTime: number = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakpointObserver: BreakpointObserver,
    configService: ConfigService,
    private dialog: MatDialog,
    notebookService: NotebookService,
    private projectService: ProjectService
  ) {
    super(configService, notebookService);
    this.breakpointObserver.observe(['(max-width: 40rem)']).subscribe((result) => {
      if (!this.collapsed) {
        this.collapsed = true;
        this.fullscreen();
      }
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.reportId = this.config.itemTypes.report.notes[0].reportId;
    this.setReportItem();
    if (this.reportItem == null) {
      return;
    }
    if (this.mode !== 'classroomMonitor') {
      this.reportItem.id = null; // set the id to null so it can be inserted as initial version, as opposed to updated. this is true for both new and just-loaded reports.
    }
    this.startAutoSaveInterval();
    this.isAddNoteButtonAvailable = this.config.itemTypes.note.enabled;

    this.subscriptions.add(
      this.NotebookService.showReportAnnotations$.subscribe(() => {
        if (this.collapsed) {
          this.toggleCollapse();
        }
        const $notebookReportContent = $('.notebook-report__content');
        setTimeout(() => {
          $notebookReportContent.animate(
            {
              scrollTop: $notebookReportContent.prop('scrollHeight')
            },
            500
          );
        }, 500);
      })
    );

    this.subscriptions.add(
      this.projectService.projectParsed$.subscribe(() => {
        if (this.saveTime == null) {
          this.setConfig();
          this.setReportItem();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setReportItem(): void {
    this.reportItem = this.NotebookService.getLatestNotebookReportItemByReportId(
      this.reportId,
      this.workgroupId
    );
    if (this.reportItem) {
      this.hasReport = true;
      const clientSaveTime = this.ConfigService.convertToClientTimestamp(
        this.reportItem.serverSaveTime
      );
      this.saveTime = clientSaveTime;
    } else {
      this.reportItem = this.NotebookService.getTemplateReportItemByReportId(this.reportId);
    }
    if (this.reportItem != null) {
      this.reportItemContent = this.projectService.injectAssetPaths(
        replaceWiseLinks(this.reportItem.content.content)
      );
    }
  }

  protected toggleCollapse(): void {
    if (this.collapsed && this.breakpointObserver.isMatched('(max-width: 40rem)')) {
      this.fullscreen();
      return;
    }
    if (this.full) {
      this.full = false;
      this.NotebookService.setReportFullScreen(false);
    }
    this.collapsed = !this.collapsed;
  }

  protected fullscreen(): void {
    if (this.collapsed) {
      this.full = true;
      this.collapsed = false;
    } else {
      this.full = !this.full;
    }
    this.NotebookService.setReportFullScreen(this.full);
  }

  protected addNotebookItemContent($event: any): void {
    this.dialog.open(NotebookNotesComponent, {
      data: { insertMode: true, requester: 'report' },
      panelClass: 'dialog-md'
    });
  }

  protected changed(value: string): void {
    this.dirty = true;
    this.reportItem.content.content = this.ConfigService.removeAbsoluteAssetPaths(
      insertWiseLinks(value)
    );
    this.saveTime = null;
  }

  private startAutoSaveInterval(): void {
    clearInterval(this.autoSaveIntervalId);
    this.autoSaveIntervalId = setInterval(() => {
      if (this.dirty) {
        this.saveNotebookReportItem();
      }
    }, this.autoSaveIntervalMS);
  }

  protected saveNotebookReportItem(): void {
    this.NotebookService.saveNotebookItem(
      this.reportItem.id,
      this.reportItem.nodeId,
      this.reportItem.localNotebookItemId,
      this.reportItem.type,
      this.reportItem.title,
      this.reportItem.content,
      this.reportItem.groups,
      Date.parse(new Date().toString())
    ).then((result: any) => {
      if (result) {
        this.dirty = false;
        // set the reportNotebookItemId to the newly-incremented id so that future saves during this
        // visit will be an update instead of an insert.
        this.reportItem.id = result.id;
        this.saveTime = this.ConfigService.convertToClientTimestamp(result.serverSaveTime);
      }
    });
  }
}
