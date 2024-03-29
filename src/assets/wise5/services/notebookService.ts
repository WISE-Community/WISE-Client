'use strict';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { StudentAssetService } from './studentAssetService';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditNotebookItemDialogComponent } from '../themes/default/notebook/edit-notebook-item-dialog/edit-notebook-item-dialog.component';
import { Annotation } from '../common/Annotation';

@Injectable()
export class NotebookService {
  // TODO: allow wise instance to set defaults in wise config?
  config = {
    enabled: false,
    label: $localize`Notebook`,
    icon: 'book',
    enableAddNew: true,
    addIcon: 'note_add',
    itemTypes: {
      note: {
        enabled: true,
        requireTextOnEveryNote: false,
        enableLink: true,
        enableClipping: true,
        enableStudentUploads: true,
        type: 'note',
        label: {
          singular: $localize`note`,
          plural: $localize`notes`,
          link: $localize`Manage Notes`,
          icon: 'note',
          color: '#1565C0'
        }
      },
      report: {
        enabled: false,
        enableLink: true,
        type: 'report',
        label: {
          singular: $localize`report`,
          plural: $localize`reports`,
          link: $localize`Report`,
          icon: 'assignment',
          color: '#AD1457'
        },
        notes: []
      }
    }
  };
  reports = [];
  publicNotebookItems = {};
  notebooksByWorkgroup = {};
  private notebookItemAnnotationReceivedSource: Subject<Annotation> = new Subject<Annotation>();
  public notebookItemAnnotationReceived$ = this.notebookItemAnnotationReceivedSource.asObservable();
  private notebookItemChosenSource: Subject<any> = new Subject<any>();
  public notebookItemChosen$ = this.notebookItemChosenSource.asObservable();
  private notebookUpdatedSource: Subject<any> = new Subject<any>();
  public notebookUpdated$ = this.notebookUpdatedSource.asObservable();
  private publicNotebookItemsRetrievedSource: Subject<any> = new Subject<any>();
  public publicNotebookItemsRetrieved$ = this.publicNotebookItemsRetrievedSource.asObservable();
  private showReportAnnotationsSource: Subject<void> = new Subject<void>();
  public showReportAnnotations$ = this.showReportAnnotationsSource.asObservable();
  private notesVisibleSource: Subject<boolean> = new Subject<boolean>();
  public notesVisible$ = this.notesVisibleSource.asObservable();
  private insertModeSource: Subject<any> = new Subject<any>();
  public insertMode$ = this.insertModeSource.asObservable();
  private reportFullScreenSource: Subject<boolean> = new Subject<boolean>();
  public reportFullScreen$ = this.reportFullScreenSource.asObservable();

  constructor(
    private dialog: MatDialog,
    public http: HttpClient,
    private ConfigService: ConfigService,
    private ProjectService: ProjectService,
    private StudentAssetService: StudentAssetService
  ) {}

  broadcastNotebookItemAnnotationReceived(annotation: Annotation) {
    this.notebookItemAnnotationReceivedSource.next(annotation);
  }

  getStudentNotebookConfig() {
    return Object.assign(this.config, this.ProjectService.project.notebook);
  }

  getTeacherNotebookConfig() {
    return Object.assign(this.config, this.ProjectService.project.teacherNotebook);
  }

  addNote(
    nodeId: string,
    file: File = null,
    text: string = null,
    studentWorkIds: number[] = null,
    isEditTextEnabled: boolean = true,
    isFileUploadEnabled: boolean = true
  ) {
    const note = null;
    const isEditMode = true;
    this.showEditNoteDialog(
      nodeId,
      note,
      isEditMode,
      file,
      text,
      isEditTextEnabled,
      isFileUploadEnabled,
      studentWorkIds
    );
  }

  editNote(nodeId: string, note: any, isEditMode: boolean = true) {
    const file = null;
    const noteText = null;
    const isEditTextEnabled = true;
    const isFileUploadEnabled = true;
    const studentWorkIds = null;
    this.showEditNoteDialog(
      nodeId,
      note,
      isEditMode,
      file,
      noteText,
      isEditTextEnabled,
      isFileUploadEnabled,
      studentWorkIds
    );
  }

  showEditNoteDialog(
    nodeId: string,
    note: any,
    isEditMode: boolean,
    file: any,
    text: string,
    isEditTextEnabled: boolean,
    isFileUploadEnabled: boolean,
    studentWorkIds: number[]
  ): void {
    this.dialog.open(EditNotebookItemDialogComponent, {
      width: '600px',
      data: {
        copyNotebookItem: (notebookItemId: string) => {
          return this.copyNotebookItem(notebookItemId);
        },
        file: file,
        isEditMode: isEditMode,
        isEditTextEnabled: isEditTextEnabled,
        isFileUploadEnabled: isFileUploadEnabled,
        nodeId: nodeId,
        note: note,
        notebookConfig: this.config,
        saveNotebookItem: (
          notebookItemId,
          nodeId,
          localNotebookItemId,
          type,
          title,
          content,
          groups,
          clientSaveTime,
          clientDeleteTime
        ) => {
          return this.saveNotebookItem(
            notebookItemId,
            nodeId,
            localNotebookItemId,
            type,
            title,
            content,
            groups,
            clientSaveTime,
            clientDeleteTime
          );
        },
        studentWorkIds: studentWorkIds,
        text: text
      }
    });
  }

  deleteNote(note) {
    const noteCopy = { ...note };
    const clientTime = Date.parse(new Date().toString());
    noteCopy.clientDeleteTime = clientTime;
    return this.updateNote(noteCopy, clientTime);
  }

  reviveNote(note) {
    const noteCopy = { ...note };
    noteCopy.clientDeleteTime = null;
    return this.updateNote(noteCopy);
  }

  updateNote(note, clientSaveTime = Date.parse(new Date().toString())) {
    note.id = null; // set to null so we're creating a new notebook item
    return this.saveNotebookItem(
      note.id,
      note.nodeId,
      note.localNotebookItemId,
      note.type,
      note.title,
      note.content,
      note.groups,
      clientSaveTime,
      note.clientDeleteTime
    );
  }

  getLatestNotebookItemByLocalNotebookItemId(
    localNotebookItemId,
    workgroupId = this.ConfigService.getWorkgroupId()
  ) {
    const notebookByWorkgroup = this.getNotebookByWorkgroup(workgroupId);
    if (notebookByWorkgroup != null) {
      const allNotebookItems = [...notebookByWorkgroup.allItems].reverse();
      for (let notebookItem of allNotebookItems) {
        if (notebookItem.localNotebookItemId === localNotebookItemId) {
          return notebookItem;
        }
      }
    }
    return null;
  }

  getLatestNotebookReportItemByReportId(
    reportId,
    workgroupId = this.ConfigService.getWorkgroupId()
  ) {
    return this.getLatestNotebookItemByLocalNotebookItemId(reportId, workgroupId);
  }

  getTemplateReportItemByReportId(reportId) {
    const reportNotes = this.config.itemTypes.report.notes;
    for (let reportNote of reportNotes) {
      if (reportNote.reportId === reportId) {
        return {
          id: null,
          type: 'report',
          localNotebookItemId: reportId,
          content: reportNote
        };
      }
    }
    return null;
  }

  getMaxScoreByReportId(reportId) {
    const reportNoteContent = this.getReportNoteContentByReportId(reportId);
    if (reportNoteContent != null && reportNoteContent.maxScore != null) {
      return reportNoteContent.maxScore;
    }
    return 0;
  }

  getNotebookConfig() {
    return this.config;
  }

  /**
   * Returns the report content for the specified reportId, or null if not exists.
   * @param reportId
   */
  getReportNoteContentByReportId(reportId) {
    const reportNotes = this.config.itemTypes.report.notes;
    for (let reportNote of reportNotes) {
      if (reportNote.reportId === reportId) {
        return reportNote;
      }
    }
    return null;
  }

  isNotebookEnabled(type: string = 'notebook') {
    return this.ProjectService.project[type] != null && this.ProjectService.project[type].enabled;
  }

  isStudentNoteEnabled() {
    return (
      this.ProjectService.project.notebook != null &&
      this.ProjectService.project.notebook.itemTypes.note.enabled
    );
  }

  isStudentNoteClippingEnabled() {
    return (
      this.isStudentNoteEnabled() &&
      this.ProjectService.project.notebook.itemTypes.note.enableClipping
    );
  }

  retrieveNotebookItems(workgroupId = null) {
    if (this.ConfigService.isPreview()) {
      // we are previewing the project, initialize dummy student data
      const workgroupId = this.ConfigService.getWorkgroupId();
      this.notebooksByWorkgroup[workgroupId] = {};
      this.notebooksByWorkgroup[workgroupId].allItems = [];
      this.notebooksByWorkgroup[workgroupId].items = [];
      this.notebooksByWorkgroup[workgroupId].deletedItems = [];
      this.groupNotebookItems();
      // pretend sending data to server
      return new Promise((resolve, reject) => {
        resolve(this.notebooksByWorkgroup[workgroupId]);
      });
    } else {
      return this.doRetrieveNotebookItems(workgroupId);
    }
  }

  doRetrieveNotebookItems(workgroupId) {
    let url = this.ConfigService.getNotebookURL();
    if (workgroupId != null) {
      url += `/workgroup/${workgroupId}`;
    }
    return this.http
      .get(url)
      .toPromise()
      .then((resultData) => {
        const notebookItems = resultData;
        return this.handleRetrieveNotebookItems(notebookItems);
      });
  }

  handleRetrieveNotebookItems(notebookItems) {
    this.notebooksByWorkgroup = {};
    for (let notebookItem of notebookItems) {
      try {
        if (notebookItem.studentAssetId != null) {
          notebookItem.studentAsset = this.StudentAssetService.getAssetById(
            notebookItem.studentAssetId
          );
        } else {
          notebookItem.content = JSON.parse(notebookItem.content);
        }
        const workgroupId = notebookItem.workgroupId;
        this.addToNotebooksByWorgkroup(notebookItem, workgroupId);
      } catch (e) {}
    }
    this.groupNotebookItems();
    return this.notebooksByWorkgroup;
  }

  addToNotebooksByWorgkroup(notebookItem, workgroupId) {
    if (this.notebooksByWorkgroup.hasOwnProperty(workgroupId)) {
      this.notebooksByWorkgroup[workgroupId].allItems.push(notebookItem);
    } else {
      this.notebooksByWorkgroup[workgroupId] = { allItems: [notebookItem] };
    }
  }

  /**
   * Groups the notebook items together in to a map-like structure by workgroup inside this.notebook.items.
   */
  groupNotebookItems() {
    for (let workgroupId in this.notebooksByWorkgroup) {
      if (this.notebooksByWorkgroup.hasOwnProperty(workgroupId)) {
        const notebookByWorkgroup = this.notebooksByWorkgroup[workgroupId];
        notebookByWorkgroup.items = {};
        notebookByWorkgroup.deletedItems = {}; // reset deleted items
        for (let ni = 0; ni < notebookByWorkgroup.allItems.length; ni++) {
          const notebookItem = notebookByWorkgroup.allItems[ni];
          const notebookItemLocalNotebookItemId = notebookItem.localNotebookItemId;
          if (notebookByWorkgroup.items.hasOwnProperty(notebookItemLocalNotebookItemId)) {
            notebookByWorkgroup.items[notebookItemLocalNotebookItemId].push(notebookItem);
          } else {
            notebookByWorkgroup.items[notebookItemLocalNotebookItemId] = [notebookItem];
          }
        }
        // Go through the items and look at the last revision of each item.
        // If it's deleted, then move the entire item array to deletedItems
        for (let notebookItemLocalNotebookItemIdKey in notebookByWorkgroup.items) {
          if (notebookByWorkgroup.items.hasOwnProperty(notebookItemLocalNotebookItemIdKey)) {
            const allRevisionsForThisLocalNotebookItemId =
              notebookByWorkgroup.items[notebookItemLocalNotebookItemIdKey];
            if (allRevisionsForThisLocalNotebookItemId != null) {
              const lastRevision =
                allRevisionsForThisLocalNotebookItemId[
                  allRevisionsForThisLocalNotebookItemId.length - 1
                ];
              if (lastRevision != null && lastRevision.serverDeleteTime != null) {
                // the last revision for this was deleted,
                // so move the entire note (with all its revisions) to deletedItems
                notebookByWorkgroup.deletedItems[
                  notebookItemLocalNotebookItemIdKey
                ] = allRevisionsForThisLocalNotebookItemId;
                delete notebookByWorkgroup.items[notebookItemLocalNotebookItemIdKey];
              }
            }
          }
        }
      }
    }
  }

  getPrivateNotebookItems(workgroupId = this.ConfigService.getWorkgroupId()) {
    const notebookByWorkgroup = this.getNotebookByWorkgroup(workgroupId);
    const privateNotebookItems = [];
    for (let notebookItem of notebookByWorkgroup.allItems) {
      if (notebookItem.groups == null || notebookItem.groups.length == 0) {
        privateNotebookItems.push(notebookItem);
      }
    }
    return privateNotebookItems;
  }

  getNotebookByWorkgroup(workgroupId = this.ConfigService.getWorkgroupId()) {
    let notebookByWorkgroup = this.notebooksByWorkgroup[workgroupId];
    if (notebookByWorkgroup == null) {
      notebookByWorkgroup = {
        allItems: [],
        items: {},
        deletedItems: {}
      };
    }
    return notebookByWorkgroup;
  }

  retrievePublicNotebookItems(group = null, periodId = null) {
    if (this.ConfigService.isPreview()) {
      // pretend we made a request to server
      return new Promise((resolve, reject) => {
        resolve({});
      });
    } else {
      return this.doRetrievePublicNotebookItems(group, periodId);
    }
  }

  doRetrievePublicNotebookItems(group, periodId) {
    const url = `${this.ConfigService.getNotebookURL()}/group/${group}`;
    const params = {};
    if (periodId != null) {
      params['periodId'] = periodId;
    }
    const options = {
      params: params
    };
    return this.http
      .get(url, options)
      .toPromise()
      .then((resultData) => {
        const publicNotebookItemsForGroup = resultData;
        return this.handleRetrievePublicNotebookItems(publicNotebookItemsForGroup, group);
      });
  }

  handleRetrievePublicNotebookItems(publicNotebookItemsForGroup, group) {
    for (let publicNotebookItemForGroup of publicNotebookItemsForGroup) {
      publicNotebookItemForGroup.content = JSON.parse(publicNotebookItemForGroup.content);
    }
    this.publicNotebookItems[group] = publicNotebookItemsForGroup;
    this.broadcastPublicNotebookItemsRetrieved({ publicNotebookItems: this.publicNotebookItems });
    return this.publicNotebookItems;
  }

  saveNotebookItem(
    notebookItemId,
    nodeId,
    localNotebookItemId,
    type,
    title,
    content,
    groups = [],
    clientSaveTime = null,
    clientDeleteTime = null
  ) {
    if (this.ConfigService.isPreview()) {
      return this.savePreviewNotebookItem(
        notebookItemId,
        nodeId,
        localNotebookItemId,
        type,
        title,
        content,
        groups,
        clientSaveTime,
        clientDeleteTime
      );
    } else {
      return this.doSaveNotebookItem(
        notebookItemId,
        nodeId,
        localNotebookItemId,
        type,
        title,
        content,
        groups,
        clientDeleteTime
      );
    }
  }

  savePreviewNotebookItem(
    notebookItemId,
    nodeId,
    localNotebookItemId,
    type,
    title,
    content,
    groups,
    clientSaveTime,
    clientDeleteTime
  ) {
    return new Promise((resolve, reject) => {
      const notebookItem = {
        content: content,
        localNotebookItemId: localNotebookItemId,
        nodeId: nodeId,
        notebookItemId: notebookItemId,
        title: title,
        type: type,
        workgroupId: this.ConfigService.getWorkgroupId(),
        groups: groups,
        clientSaveTime: clientSaveTime,
        serverSaveTime: clientSaveTime,
        clientDeleteTime: clientDeleteTime,
        serverDeleteTime: clientDeleteTime ? clientDeleteTime : null
      };
      const workgroupId = notebookItem.workgroupId;
      this.addToNotebooksByWorgkroup(notebookItem, workgroupId);
      this.groupNotebookItems();
      this.broadcastNotebookUpdated({
        notebook: this.notebooksByWorkgroup[workgroupId],
        notebookItem: notebookItem
      });
      resolve(notebookItem);
    });
  }

  doSaveNotebookItem(
    notebookItemId,
    nodeId,
    localNotebookItemId,
    type,
    title,
    content,
    groups,
    clientDeleteTime
  ) {
    const params = {
      workgroupId: this.ConfigService.getWorkgroupId(),
      notebookItemId: notebookItemId,
      localNotebookItemId: localNotebookItemId,
      nodeId: nodeId,
      type: type,
      title: title,
      content: JSON.stringify(content),
      groups: JSON.stringify(groups),
      clientSaveTime: Date.parse(new Date().toString()),
      clientDeleteTime: clientDeleteTime
    };
    if (this.ConfigService.getMode() !== 'classroomMonitor') {
      params['periodId'] = this.ConfigService.getPeriodId();
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http
      .post(this.ConfigService.getNotebookURL(), $.param(params), { headers: headers })
      .toPromise()
      .then((resultData) => {
        const notebookItem = resultData;
        this.handleSaveNotebookItem(notebookItem);
        return resultData;
      });
  }

  handleSaveNotebookItem(notebookItem) {
    if (notebookItem != null) {
      if (notebookItem.type === 'note' || notebookItem.type === 'report') {
        notebookItem.content = JSON.parse(notebookItem.content);
      }
      const workgroupId = notebookItem.workgroupId;
      if (this.isNotebookItemPrivate(notebookItem)) {
        this.updatePrivateNotebookItem(notebookItem, workgroupId);
      }
      this.broadcastNotebookUpdated({
        notebook: this.notebooksByWorkgroup[workgroupId],
        notebookItem: notebookItem
      });
    }
  }

  updatePrivateNotebookItem(notebookItem, workgroupId) {
    this.addToNotebooksByWorgkroup(notebookItem, workgroupId);
    this.groupNotebookItems();
  }

  isNotebookItemPublic(notebookItem) {
    return !this.isNotebookItemPrivate(notebookItem);
  }

  isNotebookItemPrivate(notebookItem) {
    return notebookItem.groups == null;
  }

  copyNotebookItem(notebookItemId) {
    if (!this.ConfigService.isPreview()) {
      const url = `${this.ConfigService.getNotebookURL()}/parent/${notebookItemId}`;
      const params = {
        workgroupId: this.ConfigService.getWorkgroupId(),
        clientSaveTime: Date.parse(new Date().toString())
      };
      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      return this.http
        .post(url, $.param(params), { headers: headers })
        .toPromise()
        .then((resultData) => {
          const notebookItem = resultData;
          return this.handleNewNotebookItem(notebookItem);
        });
    }
  }

  handleNewNotebookItem(notebookItem) {
    notebookItem.content = JSON.parse(notebookItem.content);
    const workgroupId = notebookItem.workgroupId;
    this.notebooksByWorkgroup[workgroupId].allItems.push(notebookItem);
    this.groupNotebookItems();
    this.broadcastNotebookUpdated({
      notebook: this.notebooksByWorkgroup[workgroupId],
      notebookItem: notebookItem
    });
    return notebookItem;
  }

  broadcastNotebookItemChosen(args: any) {
    this.notebookItemChosenSource.next(args);
  }

  broadcastNotebookUpdated(args: any) {
    this.notebookUpdatedSource.next(args);
  }

  broadcastPublicNotebookItemsRetrieved(args: any) {
    this.publicNotebookItemsRetrievedSource.next(args);
  }

  broadcastShowReportAnnotations() {
    this.showReportAnnotationsSource.next();
  }

  closeNotes(): void {
    this.setNotesVisible(false);
    this.setInsertMode({ insertMode: false });
  }

  setNotesVisible(value: boolean): void {
    this.notesVisibleSource.next(value);
  }

  setInsertMode(args: any): void {
    this.insertModeSource.next(args);
  }

  setReportFullScreen(value: boolean): void {
    this.reportFullScreenSource.next(value);
  }
}
