import { Component } from '@angular/core';
import { insertWiseLinks, replaceWiseLinks } from '../../common/wise-link/wise-link';
import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'notebook-authoring',
  templateUrl: './notebook-authoring.component.html',
  styleUrls: ['./notebook-authoring.component.scss']
})
export class NotebookAuthoringComponent {
  protected notebookChanged: Subject<void> = new Subject<void>();
  protected project: any;
  protected reportIdToAuthoringNote: any;

  constructor(
    private configService: ConfigService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.project = this.projectService.project;
    this.reportIdToAuthoringNote = {};

    if (this.project.notebook == null) {
      const projectTemplate = this.projectService.getNewProjectTemplate();
      this.project.notebook = projectTemplate.notebook;
    }

    if (this.project.teacherNotebook == null) {
      const projectTemplate = this.projectService.getNewProjectTemplate();
      projectTemplate.teacherNotebook.enabled = false;
      this.project.teacherNotebook = projectTemplate.teacherNotebook;
    }

    this.initializeTeacherNotesAuthoring();
    this.notebookChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.save();
    });
  }

  private initializeTeacherNotesAuthoring(): void {
    this.initializeNotesAuthoring(this.project.teacherNotebook.itemTypes.report.notes);
  }

  private initializeNotesAuthoring(notes: any[]): void {
    for (const note of notes) {
      this.initializeNoteAuthoring(note);
    }
  }

  private initializeNoteAuthoring(note: any): void {
    const authoringReportNote = {
      html: replaceWiseLinks(this.projectService.replaceAssetPaths(note.content))
    };
    this.setReportIdToAuthoringNote(note.reportId, authoringReportNote);
  }

  private setReportIdToAuthoringNote(reportId: string, authoringReportNote: any): void {
    this.reportIdToAuthoringNote[reportId] = authoringReportNote;
  }

  protected reportStarterTextChanged(reportId: string): void {
    const note = this.getReportNote(reportId);
    const authoringNote = this.getAuthoringReportNote(reportId);
    note.content = insertWiseLinks(this.configService.removeAbsoluteAssetPaths(authoringNote.html));
    this.save();
  }

  private getReportNote(id: string): any {
    const teacherNotes = this.project.teacherNotebook.itemTypes.report.notes;
    for (const note of teacherNotes) {
      if (note.reportId === id) {
        return note;
      }
    }
    return null;
  }

  private getAuthoringReportNote(id: string): any {
    return this.reportIdToAuthoringNote[id];
  }

  protected contentChanged(): void {
    this.notebookChanged.next();
  }

  private save(): void {
    this.projectService.saveProject();
  }
}
