import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Node } from '../common/Node';
import { ComponentContent } from '../common/ComponentContent';
import { TeacherPresentationSelectionStore } from './teacher-presentation-selection.store';
import { TeacherPresentationDialogComponent } from './teacher-presentation-dialog.component';
import { ConfigService } from '../services/configService';

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
        <span i18n>Present Student Work</span>
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
      return $localize`Choose a specific period to present student work.`;
    }
    const store = this.effectiveStore;
    if (!store || !store.hasSelections()) {
      return $localize`Choose a post or comment first to present student work.`;
    }
    return $localize`Launch classroom presentation view`;
  }

  openPresentationDialog(): void {
    const store = this.effectiveStore;
    if (this.isDisabled || !store) {
      return;
    }

    this.dialog.open(TeacherPresentationDialogComponent, {
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
  }
}
