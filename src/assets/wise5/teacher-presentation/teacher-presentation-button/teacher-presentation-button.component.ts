import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Node } from '../../common/Node';
import { ComponentContent } from '../../common/ComponentContent';
import { TeacherPresentationSelectionStore } from '../state/teacher-presentation-selection.store';
import { TeacherPresentationDialogComponent } from '../teacher-presentation-dialog/teacher-presentation-dialog.component';
import { ConfigService } from '../../services/configService';
import { TeacherDataService } from '../../services/teacherDataService';

@Component({
  selector: 'teacher-presentation-button',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <span class="inline-flex" [matTooltip]="tooltipText" matTooltipPosition="above">
      <button
        mat-stroked-button
        color="primary"
        [disabled]="isDisabled"
        (click)="openPresentationDialog()"
        class="flex items-center gap-1"
      >
        <mat-icon>co_present</mat-icon>
        <span i18n>Present</span>
      </button>
    </span>
  `
})
export class TeacherPresentationButtonComponent {
  @Input() node: Node;
  @Input() component: ComponentContent;
  @Input() periodId: number;
  @Input() periodName?: string;
  @Input() store?: TeacherPresentationSelectionStore;

  private dialog = inject(MatDialog);
  private optionalStore = inject(TeacherPresentationSelectionStore, { optional: true });
  private configService = inject(ConfigService, { optional: true });
  private dataService = inject(TeacherDataService);

  get effectiveStore(): TeacherPresentationSelectionStore | undefined {
    return this.store || this.optionalStore || undefined;
  }

  get effectivePeriodName(): string | undefined {
    if (this.periodName) return this.periodName;
    if (this.configService && this.periodId != null) {
      const period = this.configService
        .getPeriods()
        ?.find((p: any) => p.periodId === this.periodId);
      if (period) return period.periodName || period.name;
    }
    return undefined;
  }

  get isAllPeriods(): boolean {
    return this.periodId == null || this.periodId === -1;
  }

  get isDisabled(): boolean {
    if (this.isAllPeriods) {
      return true;
    }
    const store = this.effectiveStore;
    if (!store) {
      return true;
    }
    return !store.hasSelections();
  }

  get tooltipText(): string {
    if (this.isAllPeriods) {
      return $localize`Choose a specific period to present`;
    }
    const store = this.effectiveStore;
    if (!store || !store.hasSelections()) {
      if (store?.type() === 'Ideas') {
        return $localize`Choose an idea category or student response first to present`;
      }
      return $localize`Select some posts or comments to present`;
    }
    return $localize`Launch presentation view`;
  }

  private getSelectionCounts(store: TeacherPresentationSelectionStore): {
    totalIdeasSelected?: number;
    totalResponsesSelected: number;
  } {
    if (store.type() === 'Ideas') {
      let totalResponsesSelected = 0;
      store.selectedIdeaResponseMap().forEach((map) => {
        totalResponsesSelected += map.size;
      });
      totalResponsesSelected += store.standaloneResponses().size;
      return {
        totalIdeasSelected: store.selectedIdeaIds().size,
        totalResponsesSelected
      };
    } else if (store.type() === 'Discussion') {
      return {
        totalResponsesSelected: store.selectedCount()
      };
    }
    return {
      totalResponsesSelected: 0
    };
  }

  openPresentationDialog(): void {
    const store = this.effectiveStore;
    if (this.isDisabled || !store) {
      return;
    }

    const selectionCounts = this.getSelectionCounts(store);
    const startTime = Date.now();
    this.dataService.saveEvent(
      'ClassroomMonitor',
      this.node.id,
      this.component.id,
      this.component.type,
      'TeacherPresentation',
      'TeacherPresentationOpened',
      {
        periodId: this.periodId,
        ...selectionCounts
      }
    );

    const dialogRef = this.dialog.open(TeacherPresentationDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'teacher-presentation-dialog-panel',
      data: {
        nodeId: this.node.id,
        component: this.component,
        periodId: this.periodId,
        periodName: this.effectivePeriodName,
        store: store
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      const durationMs = Date.now() - startTime;
      this.dataService.saveEvent(
        'ClassroomMonitor',
        this.node.id,
        this.component.id,
        this.component.type,
        'TeacherPresentation',
        'TeacherPresentationClosed',
        {
          periodId: this.periodId,
          durationMs
        }
      );
    });
  }
}
