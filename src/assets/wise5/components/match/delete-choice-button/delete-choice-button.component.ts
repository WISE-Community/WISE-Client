import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatIconModule, MatTooltipModule],
  selector: 'delete-choice-button',
  standalone: true,
  styles: `
    .mat-mdc-icon-button {
      height: 24px;
      width: 24px;
      line-height: 24px;
    }
  `,
  template: `
    <button
      mat-icon-button
      (click)="deleteChoice()"
      [disabled]="isDisabled"
      matTooltip="Delete item"
      matTooltipPosition="above"
      i18n-matTooltip
    >
      <mat-icon>clear</mat-icon>
    </button>
  `
})
export class DeleteChoiceButtonComponent {
  @Input() buckets: any;

  @Input() isDisabled: boolean;

  @Input() item: any;

  @Output() onItemDeleted = new EventEmitter<void>();

  deleteChoice(): void {
    if (confirm($localize`Are you sure you want to delete this item?`)) {
      this.buckets.forEach((bucket) => {
        let i = 0;
        bucket.items.forEach((bucketItem) => {
          if (bucketItem.id === this.item.id) {
            bucket.items.splice(i, 1);
          }
          i++;
        });
      });
      this.onItemDeleted.next();
    }
  }
}
