import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentDataService } from '../../../assets/wise5/services/studentDataService';
import { NotebookParentComponent } from '../notebook-parent/notebook-parent.component';

@Component({
  selector: 'notebook-notes',
  styleUrls: ['notebook-notes.component.scss'],
  templateUrl: 'notebook-notes.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NotebookNotesComponent extends NotebookParentComponent {
  @Input() viewOnly: boolean;

  groups = [];
  groupNameToGroup = {};
  hasPrivateNotes: boolean = false;
  insertArgs: any = {
    insertMode: false
  };
  label: any;
  selectedTabIndex = 0;
  title: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    ConfigService: ConfigService,
    NotebookService: NotebookService,
    private ProjectService: ProjectService,
    private studentDataService: StudentDataService
  ) {
    super(ConfigService, NotebookService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setLabel();
    this.addPersonalGroupToGroups();
    this.addSpacesToGroups();
    this.hasPrivateNotes = this.isHasPrivateNotes();

    this.subscriptions.add(
      this.NotebookService.notebookUpdated$.subscribe(({ notebookItem }) => {
        if (
          (notebookItem.groups == null || notebookItem.groups.length === 0) &&
          notebookItem.type === 'note'
        ) {
          this.updatePrivateNotebookNote(notebookItem);
        }
        if (notebookItem.groups != null && notebookItem.groups.includes('public')) {
          this.updatePublicNotebookNote(notebookItem);
        }
        this.hasPrivateNotes = this.isHasPrivateNotes();
      })
    );

    this.subscriptions.add(
      this.NotebookService.insertMode$.subscribe((args) => {
        this.insertArgs = args;
        if (args.visibleSpace) {
          this.selectedTabIndex = args.visibleSpace === 'public' ? 1 : 0;
        }
      })
    );

    this.subscriptions.add(
      this.NotebookService.publicNotebookItemsRetrieved$.subscribe(() => {
        for (const group of this.groups) {
          if (group.name !== 'private') {
            group.items = this.NotebookService.publicNotebookItems[group.name];
          }
        }
      })
    );

    this.subscriptions.add(
      this.ProjectService.projectParsed$.subscribe(() => {
        this.setConfig();
        this.setLabel();
      })
    );

    this.NotebookService.retrievePublicNotebookItems('public');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setLabel(): void {
    this.label = this.config.itemTypes.note.label;
  }

  isHasPrivateNotes(): boolean {
    return this.groupNameToGroup['private'].items.some((note) => note.serverDeleteTime == null);
  }

  addPersonalGroupToGroups(): void {
    const personalGroup = {
      title: $localize`Personal`,
      name: 'private',
      isEditAllowed: true,
      items: []
    };
    this.groupNameToGroup['private'] = personalGroup;
    for (const [personalItemKey, personalItemValue] of Object.entries(this.notebook.items)) {
      const personalItems = personalItemValue as any;
      const item = personalItems[personalItems.length - 1];
      if (item.type === 'note') {
        personalGroup.items.push(item);
      }
    }
    this.groups.push(personalGroup);
  }

  addSpacesToGroups(): void {
    for (const space of this.ProjectService.getSpaces()) {
      if (space.isShowInNotebook) {
        const spaceGroup = {
          title: space.name,
          name: space.id,
          isEditAllowed: true,
          items: []
        };
        this.groupNameToGroup[space.id] = spaceGroup;
        this.groups.push(spaceGroup);
      }
    }
  }

  updatePrivateNotebookNote(notebookItem: any): void {
    this.updateNotebookNote(
      this.groupNameToGroup['private'],
      notebookItem.localNotebookItemId,
      notebookItem.workgroupId,
      notebookItem
    );
    if (this.groupNameToGroup['public'] != null) {
      this.removeNotebookNote(
        this.groupNameToGroup['public'],
        notebookItem.localNotebookItemId,
        notebookItem.workgroupId
      );
    }
  }

  updatePublicNotebookNote(notebookItem: any): void {
    this.updateNotebookNote(
      this.groupNameToGroup['public'],
      notebookItem.localNotebookItemId,
      notebookItem.workgroupId,
      notebookItem
    );
    this.removeNotebookNote(
      this.groupNameToGroup['private'],
      notebookItem.localNotebookItemId,
      notebookItem.workgroupId
    );
  }

  updateNotebookNote(
    group: any,
    localNotebookItemId: string,
    workgroupId: number,
    notebookItem: any
  ): void {
    let added = false;
    let items = group.items;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.localNotebookItemId == localNotebookItemId && item.workgroupId == workgroupId) {
        items[i] = notebookItem;
        added = true;
      }
    }
    if (!added) {
      items.push(notebookItem);
    }
  }

  removeNotebookNote(group: any, localNotebookItemId: string, workgroupId: number): void {
    let items = group.items;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.localNotebookItemId == localNotebookItemId && item.workgroupId == workgroupId) {
        items.splice(i, 1);
        i--;
      }
    }
  }

  addNote() {
    this.NotebookService.addNote(this.studentDataService.getCurrentNodeId());
  }

  select({ event, note }: any): void {
    if (this.insertArgs.insertMode) {
      this.insertArgs.notebookItem = note;
      this.NotebookService.broadcastNotebookItemChosen(this.insertArgs);
    } else {
      const isEditMode = !this.viewOnly;
      this.NotebookService.editNote(this.studentDataService.getCurrentNodeId(), note, isEditMode);
    }
  }

  close(): void {
    this.NotebookService.closeNotes();
  }

  filterDeleted(item: any): boolean {
    return item.serverDeleteTime == null;
  }
}
