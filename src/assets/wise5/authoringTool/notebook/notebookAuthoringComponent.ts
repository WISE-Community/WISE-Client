'use strict';

import { ConfigService } from '../../services/configService';
import { SpaceService } from '../../services/spaceService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { UtilService } from '../../services/utilService';
import { newProjectTemplate } from '../newProjectTemplate';

class NotebookAuthoringController {
  $translate: any;
  isPublicNotebookEnabled: boolean;
  projectId: number;
  project: any;
  reportIdToAuthoringNote: any;

  static $inject = [
    '$filter',
    '$stateParams',
    'ConfigService',
    'ProjectService',
    'SpaceService',
    'UtilService'
  ];

  constructor(
    $filter: any,
    private $stateParams: any,
    private ConfigService: ConfigService,
    private ProjectService: TeacherProjectService,
    private SpaceService: SpaceService,
    private UtilService: UtilService
  ) {
    this.$translate = $filter('translate');
  }

  $onInit() {
    this.projectId = this.$stateParams.projectId;
    this.project = this.ProjectService.project;
    this.reportIdToAuthoringNote = {};

    if (this.project.notebook == null) {
      const projectTemplate = newProjectTemplate;
      this.project.notebook = projectTemplate.notebook;
    }

    if (this.project.teacherNotebook == null) {
      const projectTemplate = newProjectTemplate;
      projectTemplate.teacherNotebook.enabled = false;
      this.project.teacherNotebook = projectTemplate.teacherNotebook;
    }

    this.initializeStudentNotesAuthoring();
    this.initializeTeacherNotesAuthoring();
    this.isPublicNotebookEnabled = this.ProjectService.isSpaceExists('public');
  }

  initializeStudentNotesAuthoring() {
    this.initializeNotesAuthoring(this.project.notebook.itemTypes.report.notes);
  }

  initializeTeacherNotesAuthoring() {
    this.initializeNotesAuthoring(this.project.teacherNotebook.itemTypes.report.notes);
  }

  initializeNotesAuthoring(notes) {
    for (const note of notes) {
      this.initializeNoteAuthoring(note);
    }
  }

  initializeNoteAuthoring(note) {
    const authoringReportNote = {
      html: this.UtilService.replaceWISELinks(this.ProjectService.replaceAssetPaths(note.content))
    };
    this.setReportIdToAuthoringNote(note.reportId, authoringReportNote);
  }

  setReportIdToAuthoringNote(reportId, authoringReportNote) {
    this.reportIdToAuthoringNote[reportId] = authoringReportNote;
  }

  getAuthoringReportNote(id) {
    return this.reportIdToAuthoringNote[id];
  }

  getReportNote(id) {
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

  addReportNote() {
    const projectTemplate = newProjectTemplate;
    if (this.project.notebook.itemTypes.report.notes == null) {
      this.project.notebook.itemTypes.report.notes = [];
    }
    if (this.project.notebook.itemTypes.report.notes < 1) {
      this.project.notebook.itemTypes.report.notes.push(
        projectTemplate.notebook.itemTypes.report.notes[0]
      );
    }
  }

  reportStarterTextChanged(reportId) {
    const note = this.getReportNote(reportId);
    const authoringNote = this.getAuthoringReportNote(reportId);
    note.content = this.UtilService.insertWISELinks(
      this.ConfigService.removeAbsoluteAssetPaths(authoringNote.html)
    );
    this.save();
  }

  togglePublicNotebook() {
    if (this.isPublicNotebookEnabled) {
      this.SpaceService.addSpace('public', 'Public');
    } else {
      this.SpaceService.removeSpace('public');
    }
  }

  disablePublicSpace() {
    this.SpaceService.removeSpace('public');
  }

  componentChanged() {
    this.save();
  }

  save() {
    this.ProjectService.saveProject();
  }
}

export const NotebookAuthoringComponent = {
  templateUrl: `/assets/wise5/authoringTool/notebook/notebookAuthoring.html`,
  controller: NotebookAuthoringController
};
