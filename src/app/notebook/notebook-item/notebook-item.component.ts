import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogWithConfirmComponent } from '../../../assets/wise5/directives/dialog-with-confirm/dialog-with-confirm.component';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'notebook-item',
  styleUrls: ['notebook-item.component.scss'],
  templateUrl: 'notebook-item.component.html'
})
export class NotebookItemComponent {
  @Input()
  note: any;

  @Input()
  config: any;

  @Input()
  itemId: string;

  @Input()
  group: string;

  @Input()
  isChooseMode: boolean;

  item: any;
  type: string;
  label: any;
  color: string;

  @Output()
  onSelect: EventEmitter<any> = new EventEmitter<any>();

  notebookUpdatedSubscription: Subscription;

  constructor(
    private ConfigService: ConfigService,
    private NotebookService: NotebookService,
    private ProjectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.item = this.note;
    this.type = this.item ? this.item.type : null;
    this.label = this.config.itemTypes[this.type].label;
    if (this.group === 'public') {
      this.color = 'orange';
    } else {
      this.color = this.label.color;
    }

    this.notebookUpdatedSubscription = this.NotebookService.notebookUpdated$.subscribe(
      ({ notebook }) => {
        if (notebook.items[this.itemId]) {
          this.item = notebook.items[this.itemId].last();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.notebookUpdatedSubscription.unsubscribe();
  }

  isItemInGroup(group: string): boolean {
    return this.item.groups != null && this.item.groups.includes(group);
  }

  getItemNodeId(): string {
    if (this.item == null) {
      return null;
    } else {
      return this.item.nodeId;
    }
  }

  getItemNodeLink(): string {
    if (this.item == null) {
      return '';
    } else {
      return this.ProjectService.getNodePositionAndTitleByNodeId(this.item.nodeId);
    }
  }

  getItemNodePosition(): string {
    if (this.item == null) {
      return '';
    } else {
      return this.ProjectService.getNodePositionById(this.item.nodeId);
    }
  }

  doDelete(ev: any): void {
    ev.stopPropagation();
    this.dialog
      .open(DialogWithConfirmComponent, {
        data: {
          content: $localize`Are you sure you want to delete this ${this.label.singular}:singular term for note in unit:?`,
          title: $localize`Delete ${this.label.singular}:singular term for note in unit:`
        }
      })
      .afterClosed()
      .subscribe((doDelete: boolean) => {
        if (doDelete) {
          this.NotebookService.deleteNote(this.item);
        }
      });
  }

  doRevive(ev: any): void {
    ev.stopPropagation();
    this.dialog
      .open(DialogWithConfirmComponent, {
        data: {
          content: $localize`Are you sure you want to revive this ${this.label.singular}:singular term for note in unit:?`,
          title: $localize`Revive ${this.label.singular}:singular term for note in unit:`
        }
      })
      .afterClosed()
      .subscribe((doRevive: boolean) => {
        if (doRevive) {
          this.NotebookService.reviveNote(this.item);
        }
      });
  }

  doSelect(event: any): void {
    if (this.onSelect) {
      this.onSelect.emit({ event: event, note: this.item });
    }
  }

  canShareNotebookItem(): boolean {
    return (
      this.ProjectService.isSpaceExists('public') &&
      this.isMyNotebookItem() &&
      this.item.serverDeleteTime == null &&
      !this.isChooseMode &&
      !this.isItemInGroup('public')
    );
  }

  canUnshareNotebookItem(): boolean {
    return (
      this.ProjectService.isSpaceExists('public') &&
      this.isMyNotebookItem() &&
      this.item.serverDeleteTime == null &&
      !this.isChooseMode &&
      this.isItemInGroup('public')
    );
  }

  canDeleteNotebookItem(): boolean {
    return this.isMyNotebookItem() && this.item.serverDeleteTime == null && !this.isChooseMode;
  }

  canReviveNotebookItem(): boolean {
    return this.item.serverDeleteTime != null && !this.isChooseMode;
  }

  isMyNotebookItem(): boolean {
    return this.item.workgroupId === this.ConfigService.getWorkgroupId();
  }

  isNotebookItemActive(): boolean {
    return this.item.serverDeleteTime == null;
  }
}
