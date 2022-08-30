import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NotebookService } from '../../../../services/notebookService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  selector: 'notebook-workgroup-grading',
  templateUrl: './notebook-workgroup-grading.component.html',
  styleUrls: ['./notebook-workgroup-grading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotebookWorkgroupGradingComponent implements OnInit {
  @Input() expand: boolean;
  maxScore: number;
  notebook: any;
  @Input() notebookConfig: any;
  @Input() notesEnabled: boolean;
  @Output() onUpdateExpand: EventEmitter<any> = new EventEmitter();
  @Input() reportEnabled: boolean;
  reportHasWork: boolean;
  @Input() reportTitle: string;
  themePath: string;
  @Input() workgroup: any;

  constructor(
    private notebookService: NotebookService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.themePath = this.projectService.getThemePath();
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
