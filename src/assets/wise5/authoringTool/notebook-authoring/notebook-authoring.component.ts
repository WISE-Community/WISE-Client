import { Component } from '@angular/core';
import { insertWiseLinks, replaceWiseLinks } from '../../common/wise-link/wise-link';
import { ConfigService } from '../../services/configService';
import { SpaceService } from '../../services/spaceService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { UpgradeModule } from '@angular/upgrade/static';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'notebook-authoring',
  templateUrl: './notebook-authoring.component.html',
  styleUrls: ['./notebook-authoring.component.scss']
})
export class NotebookAuthoringComponent {
  notebookChanged: Subject<void> = new Subject<void>();
  isPublicNotebookEnabled: boolean;
  projectId: number;
  project: any;
  reportIdToAuthoringNote: any;

  constructor(
    private configService: ConfigService,
    private projectService: TeacherProjectService,
    private spaceService: SpaceService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.projectId = this.upgrade.$injector.get('$stateParams').projectId;
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

    this.initializeStudentNotesAuthoring();
    this.initializeTeacherNotesAuthoring();
    this.isPublicNotebookEnabled = this.projectService.isSpaceExists('public');
    this.notebookChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.save();
    });
  }

  initializeStudentNotesAuthoring(): void {
    this.initializeNotesAuthoring(this.project.notebook.itemTypes.report.notes);
  }

  initializeTeacherNotesAuthoring(): void {
    this.initializeNotesAuthoring(this.project.teacherNotebook.itemTypes.report.notes);
  }

  initializeNotesAuthoring(notes: any[]): void {
    for (const note of notes) {
      this.initializeNoteAuthoring(note);
    }
  }

  initializeNoteAuthoring(note: any): void {
    const authoringReportNote = {
      html: replaceWiseLinks(this.projectService.replaceAssetPaths(note.content))
    };
    this.setReportIdToAuthoringNote(note.reportId, authoringReportNote);
  }

  setReportIdToAuthoringNote(reportId: string, authoringReportNote: any): void {
    this.reportIdToAuthoringNote[reportId] = authoringReportNote;
  }

  getAuthoringReportNote(id: string): any {
    return this.reportIdToAuthoringNote[id];
  }

  getReportNote(id: string): any {
    const studentNotes = this.project.notebook.itemTypes.report.notes;
    for (const note of studentNotes) {
      if (note.reportId === id) {
        return note;
      }
    }
    const teacherNotes = this.project.teacherNotebook.itemTypes.report.notes;
    for (const note of teacherNotes) {
      if (note.reportId === id) {
        return note;
      }
    }
    return null;
  }

  addReportNote(): void {
    const projectTemplate = this.projectService.getNewProjectTemplate();
    if (this.project.notebook.itemTypes.report.notes == null) {
      this.project.notebook.itemTypes.report.notes = [];
    }
    if (this.project.notebook.itemTypes.report.notes < 1) {
      this.project.notebook.itemTypes.report.notes.push(
        projectTemplate.notebook.itemTypes.report.notes[0]
      );
    }
  }

  reportStarterTextChanged(reportId: string): void {
    const note = this.getReportNote(reportId);
    const authoringNote = this.getAuthoringReportNote(reportId);
    note.content = insertWiseLinks(this.configService.removeAbsoluteAssetPaths(authoringNote.html));
    this.save();
  }

  togglePublicNotebook(): void {
    if (this.isPublicNotebookEnabled) {
      this.spaceService.addSpace('public', 'Public');
    } else {
      this.spaceService.removeSpace('public');
    }
  }

  disablePublicSpace(): void {
    this.spaceService.removeSpace('public');
  }

  contentChanged(): void {
    this.notebookChanged.next();
  }

  save(): void {
    this.projectService.saveProject();
  }
}
