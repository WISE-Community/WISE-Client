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
  canDelete: boolean;
  canRevive: boolean;
  color: string;
  @Input() config: any;
  @Input() group: string;
  @Input() isChooseMode: boolean;
  item: any;
  @Input() itemId: string;
  label: any;
  @Input() note: any;
  notebookUpdatedSubscription: Subscription;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  type: string;

  constructor(
    private configService: ConfigService,
    private notebookService: NotebookService,
    private projectService: ProjectService,
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
    this.canDelete = this.canDeleteNotebookItem();
    this.canRevive = this.canReviveNotebookItem();

    this.notebookUpdatedSubscription = this.notebookService.notebookUpdated$.subscribe(
      ({ notebook }) => {
        if (notebook.items[this.itemId]) {
          const items = notebook.items[this.itemId];
          this.item = items[items.length - 1];
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
      return this.projectService.getNodePositionAndTitle(this.item.nodeId);
    }
  }

  getItemNodePosition(): string {
    if (this.item == null) {
      return '';
    } else {
      return this.projectService.getNodePositionById(this.item.nodeId);
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
          this.notebookService.deleteNote(this.item);
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
          this.notebookService.reviveNote(this.item);
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
      this.projectService.isSpaceExists('public') &&
      this.isMyNotebookItem() &&
      this.item.serverDeleteTime == null &&
      !this.isChooseMode &&
      !this.isItemInGroup('public')
    );
  }

  canUnshareNotebookItem(): boolean {
    return (
      this.projectService.isSpaceExists('public') &&
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

  private isMyNotebookItem(): boolean {
    return this.item.workgroupId === this.configService.getWorkgroupId();
  }

  isNotebookItemActive(): boolean {
    return this.item.serverDeleteTime == null;
  }
}
