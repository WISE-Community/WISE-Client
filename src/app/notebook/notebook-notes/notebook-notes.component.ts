import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentDataService } from '../../../assets/wise5/services/studentDataService';
import { NotebookParentComponent } from '../notebook-parent/notebook-parent.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NotebookItemComponent } from '../notebook-item/notebook-item.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    NotebookItemComponent
  ],
  selector: 'notebook-notes',
  standalone: true,
  styleUrl: 'notebook-notes.component.scss',
  templateUrl: 'notebook-notes.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NotebookNotesComponent extends NotebookParentComponent {
  protected groups = [];
  private groupNameToGroup = {};
  protected hasPrivateNotes: boolean = false;
  protected insertArgs: any = {
    insertMode: false
  };
  protected label: any;
  protected selectedTabIndex = 0;
  private subscriptions: Subscription = new Subscription();
  @Input() viewOnly: boolean;

  constructor(
    configService: ConfigService,
    private dataService: StudentDataService,
    NotebookService: NotebookService,
    private projectService: ProjectService
  ) {
    super(configService, NotebookService);
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
      this.projectService.projectParsed$.subscribe(() => {
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

  private addSpacesToGroups(): void {
    for (const space of this.projectService.getSpaces()) {
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

  private updatePrivateNotebookNote(notebookItem: any): void {
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

  private updatePublicNotebookNote(notebookItem: any): void {
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

  private updateNotebookNote(
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

  private removeNotebookNote(group: any, localNotebookItemId: string, workgroupId: number): void {
    let items = group.items;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.localNotebookItemId == localNotebookItemId && item.workgroupId == workgroupId) {
        items.splice(i, 1);
        i--;
      }
    }
  }

  protected addNote(): void {
    this.NotebookService.addNote(this.dataService.getCurrentNodeId());
  }

  protected select({ event, note }: any): void {
    if (this.insertArgs.insertMode) {
      this.insertArgs.notebookItem = note;
      this.NotebookService.broadcastNotebookItemChosen(this.insertArgs);
    } else {
      const isEditMode = !this.viewOnly;
      this.NotebookService.editNote(this.dataService.getCurrentNodeId(), note, isEditMode);
    }
  }

  protected close(): void {
    this.NotebookService.closeNotes();
  }
}
