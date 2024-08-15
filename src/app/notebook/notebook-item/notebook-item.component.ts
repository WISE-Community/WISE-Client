import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogWithConfirmComponent } from '../../../assets/wise5/directives/dialog-with-confirm/dialog-with-confirm.component';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule
  ],
  selector: 'notebook-item',
  standalone: true,
  styleUrl: 'notebook-item.component.scss',
  templateUrl: 'notebook-item.component.html'
})
export class NotebookItemComponent {
  protected canDelete: boolean;
  protected canRevive: boolean;
  protected color: string;
  @Input() config: any;
  @Input() group: string;
  @Input() isChooseMode: boolean;
  protected item: any;
  @Input() itemId: string;
  protected label: any;
  @Input() note: any;
  private notebookUpdatedSubscription: Subscription;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  private type: string;

  constructor(
    private configService: ConfigService,
    private dialog: MatDialog,
    private notebookService: NotebookService,
    private projectService: ProjectService
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

  ngOnChanges(): void {
    this.label = this.config.itemTypes[this.type]?.label;
  }

  ngOnDestroy(): void {
    this.notebookUpdatedSubscription.unsubscribe();
  }

  protected getItemNodePosition(): string {
    return this.item == null ? '' : this.projectService.getNodePositionById(this.item.nodeId);
  }

  protected delete(event: Event): void {
    event.stopPropagation();
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

  protected revive(event: Event): void {
    event.stopPropagation();
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

  protected select(event: any): void {
    if (this.onSelect) {
      this.onSelect.emit({ event: event, note: this.item });
    }
  }

  private canDeleteNotebookItem(): boolean {
    return this.isMyNotebookItem() && this.item.serverDeleteTime == null && !this.isChooseMode;
  }

  private canReviveNotebookItem(): boolean {
    return this.item.serverDeleteTime != null && !this.isChooseMode;
  }

  private isMyNotebookItem(): boolean {
    return this.item.workgroupId === this.configService.getWorkgroupId();
  }
}
