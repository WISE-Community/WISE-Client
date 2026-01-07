import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { NotebookService } from '../../../../services/notebookService';
import { MatButton } from '@angular/material/button';
import { NgClass, DatePipe } from '@angular/common';
import { MatListItem } from '@angular/material/list';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { NotebookNotesComponent } from '../../../../../../app/notebook/notebook-notes/notebook-notes.component';
import { NotebookReportComponent } from '../../../../../../app/notebook/notebook-report/notebook-report.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButton,
    NgClass,
    MatListItem,
    MatTabGroup,
    MatTab,
    NotebookNotesComponent,
    NotebookReportComponent,
    DatePipe
  ],
  selector: 'notebook-workgroup-grading',
  styleUrl: './notebook-workgroup-grading.component.scss',
  templateUrl: './notebook-workgroup-grading.component.html'
})
export class NotebookWorkgroupGradingComponent implements OnInit {
  private notebookService = inject(NotebookService);

  @Input() expand: boolean;
  maxScore: number;
  notebook: any;
  @Input() notebookConfig: any;
  @Input() notesEnabled: boolean;
  @Output() onUpdateExpand: EventEmitter<any> = new EventEmitter();
  @Input() reportEnabled: boolean;
  reportHasWork: boolean;
  @Input() reportTitle: string;
  @Input() workgroup: any;

  ngOnInit(): void {
    if (this.reportEnabled) {
      const reportId = this.notebookConfig.itemTypes.report.notes[0].reportId;
      this.maxScore = this.notebookService.getMaxScoreByReportId(reportId);
    }
    this.notebook = this.notebookService.getNotebookByWorkgroup(this.workgroup.workgroupId);
  }

  ngOnChanges(): void {
    this.reportHasWork = this.workgroup.report ? true : false;
  }

  toggleExpand(): void {
    const expand = !this.expand;
    this.onUpdateExpand.emit({ workgroupId: this.workgroup.workgroupId, isExpanded: expand });
  }

  getNumActiveNotes(): number {
    return this.workgroup.notes.filter((note) => {
      return note.serverDeleteTime == null;
    }).length;
  }
}
