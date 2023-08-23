import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { copy } from '../../common/object/object';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { TeacherDataService } from '../../services/teacherDataService';

@Component({
  selector: 'notebook-grading',
  templateUrl: './notebook-grading.component.html',
  styleUrls: ['./notebook-grading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotebookGradingComponent implements OnInit {
  canViewStudentNames: boolean;
  colspan: number;
  isExpandAll: boolean = false;
  notebookConfig: any;
  notesEnabled: boolean = false;
  reportEnabled: boolean = false;
  reportTitle: string = '';
  showAllNotes: boolean = false;
  showAllReports: boolean = false;
  sort: string = 'team';
  sortedWorkgroups: any[] = [];
  teacherWorkgroupId: number;
  workgroups: any[];
  workgroupInViewById: any = {};
  workVisibilityById: any = {};

  constructor(
    private configService: ConfigService,
    private notebookService: NotebookService,
    private dataService: TeacherDataService
  ) {}

  ngOnInit(): void {
    this.teacherWorkgroupId = this.configService.getWorkgroupId();
    this.workgroups = copy(this.configService.getClassmateUserInfos());
    this.notebookConfig = this.notebookService.getStudentNotebookConfig();
    this.notesEnabled = this.notebookConfig.itemTypes.note.enabled;
    this.reportEnabled = this.notebookConfig.itemTypes.report.enabled;
    this.reportTitle = this.notebookConfig.itemTypes.report.notes[0].title;
    this.colspan = this.getColspan();
    for (const workgroup of this.workgroups) {
      if (this.notesEnabled) {
        workgroup.notes = this.getWorkgroupNotes(workgroup.workgroupId);
      }
      if (this.reportEnabled) {
        const reportId = this.notebookConfig.itemTypes.report.notes[0].reportId;
        workgroup.report = this.notebookService.getLatestNotebookReportItemByReportId(
          reportId,
          workgroup.workgroupId
        );
      }
    }
    this.setWorkgroupsById();
    this.sortWorkgroups();
  }

  sortWorkgroups(): void {
    this.sortedWorkgroups = [];
    for (const workgroup of this.workgroups) {
      this.sortedWorkgroups.push(workgroup);
    }
    switch (this.sort) {
      case 'team':
        this.sortedWorkgroups.sort(this.sortTeamAscending);
        break;
      case '-team':
        this.sortedWorkgroups.sort(this.sortTeamDescending);
        break;
      case 'student':
        this.sortedWorkgroups.sort(this.createSortDisplayNames('asc'));
        break;
      case '-student':
        this.sortedWorkgroups.sort(this.createSortDisplayNames('desc'));
        break;
      case 'notes':
        this.sortedWorkgroups.sort(this.createSortNumNotes('asc'));
        break;
      case '-notes':
        this.sortedWorkgroups.sort(this.createSortNumNotes('desc'));
        break;
      case 'status':
        this.sortedWorkgroups.sort(this.createSortReportSaveTime('asc'));
        break;
      case '-status':
        this.sortedWorkgroups.sort(this.createSortReportSaveTime('desc'));
        break;
    }
  }

  private sortTeamAscending(workgroupA: any, workgroupB: any): number {
    return workgroupA.workgroupId - workgroupB.workgroupId;
  }

  private sortTeamDescending(workgroupA: any, workgroupB: any): number {
    return workgroupB.workgroupId - workgroupA.workgroupId;
  }

  private createSortDisplayNames(direction: string): any {
    return (workgroupA: any, workgroupB: any): number => {
      const aDisplayNames = workgroupA.displayNames;
      const bDisplayNames = workgroupB.displayNames;
      if (aDisplayNames === bDisplayNames) {
        return workgroupA.workgroupId - workgroupB.workgroupId;
      } else {
        if (direction === 'asc') {
          return aDisplayNames.toLowerCase().localeCompare(bDisplayNames.toLowerCase());
        } else {
          return bDisplayNames.toLowerCase().localeCompare(aDisplayNames.toLowerCase());
        }
      }
    };
  }

  private createSortNumNotes(direction: string): any {
    return (workgroupA: any, workgroupB: any): number => {
      const aNumNotes = workgroupA.notes.length;
      const bNumNotes = workgroupB.notes.length;
      if (aNumNotes === bNumNotes) {
        return workgroupA.workgroupId - workgroupB.workgroupId;
      } else {
        if (direction === 'asc') {
          return aNumNotes - bNumNotes;
        } else {
          return bNumNotes - aNumNotes;
        }
      }
    };
  }

  private createSortReportSaveTime(direction: string): any {
    const getServerSaveTime = this.getServerSaveTime;
    return (workgroupA: any, workgroupB: any) => {
      const aServerSaveTime = getServerSaveTime(workgroupA);
      const bServerSaveTime = getServerSaveTime(workgroupB);
      if (aServerSaveTime === bServerSaveTime) {
        return workgroupA.workgroupId - workgroupB.workgroupId;
      } else {
        if (direction === 'asc') {
          return aServerSaveTime - bServerSaveTime;
        } else {
          return bServerSaveTime - aServerSaveTime;
        }
      }
    };
  }

  private getServerSaveTime(workgroup: any): number {
    return workgroup.report?.serverSaveTime ? workgroup.report.serverSaveTime : 0;
  }

  private getColspan(): number {
    let colspan = 4;
    if (this.notesEnabled) {
      if (this.reportEnabled) {
        // TODO: set to 5 when notebook grading is fixed
        // colspan = 5;
        colspan = 4;
      } else {
        colspan = 3;
      }
    }
    return colspan;
  }

  private getWorkgroupNotes(workgroupId: number): any[] {
    const notes = this.notebookService.getPrivateNotebookItems(workgroupId);
    return notes.filter((note) => {
      return note.type !== 'report';
    });
  }

  private setWorkgroupsById(): void {
    for (const workgroup of this.workgroups) {
      this.workVisibilityById[workgroup.workgroupId] = false;
      this.workgroupInViewById[workgroup.workgroupId] = false;
    }
  }

  expandAll(): void {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      if (this.workgroupInViewById[workgroupId]) {
        this.workVisibilityById[workgroupId] = true;
      }
    }
    this.isExpandAll = true;
  }

  collapseAll(): void {
    for (const workgroup of this.workgroups) {
      this.workVisibilityById[workgroup.workgroupId] = false;
    }
    this.isExpandAll = false;
  }

  onUpdateExpand({ workgroupId, isExpanded }): void {
    this.workVisibilityById[workgroupId] = isExpanded;
  }

  getNotebookConfigForWorkgroup(workgroupId: number): any {
    if (
      this.configService.isRunOwner(workgroupId) ||
      this.configService.isRunSharedTeacher(workgroupId)
    ) {
      return this.notebookService.getTeacherNotebookConfig();
    } else {
      return this.notebookService.getStudentNotebookConfig();
    }
  }

  isWorkgroupShown(workgroup: number): boolean {
    return this.dataService.isWorkgroupShown(workgroup);
  }

  setSort(value: string): void {
    if (this.sort === value) {
      this.sort = `-${value}`;
    } else {
      this.sort = value;
    }
    this.sortWorkgroups();
  }

  onIntersection(
    workgroupId: number,
    intersectionObserverEntries: IntersectionObserverEntry[]
  ): void {
    for (const entry of intersectionObserverEntries) {
      this.workgroupInViewById[workgroupId] = entry.isIntersecting;
      if (this.isExpandAll && entry.isIntersecting) {
        this.workVisibilityById[workgroupId] = true;
      }
    }
  }
}
