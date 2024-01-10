import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'save-time-message',
  styleUrls: ['save-time-message.component.scss'],
  templateUrl: 'save-time-message.component.html'
})
export class SaveTimeMessageComponent {
  @Input() isAutoSave: boolean;
  @Input() isInactive: boolean;
  @Input() isSubmit: boolean;
  @Input() saveTime: number;
  @Input() timeOnly: boolean;
  @Input() tooltipPosition: 'left' | 'right' | 'above' | 'below' | 'before' | 'after';

  message: string;
  tooltip: string;

  constructor(@Inject(LOCALE_ID) private localeID: string) {}

  ngOnChanges(): void {
    this.tooltip = this.getSaveTimeText(this.saveTime, true);
    const saveTimeText = this.getSaveTimeText(this.saveTime, this.isInactive);
    if (this.timeOnly) {
      this.message = saveTimeText;
    } else if (this.isSubmit) {
      this.message = $localize`Submitted ${saveTimeText}:saveTime:`;
    } else if (this.isAutoSave) {
      this.message = $localize`Auto Saved ${saveTimeText}:saveTime:`;
    } else {
      this.message = $localize`Saved ${saveTimeText}:saveTime:`;
    }
  }

  private getSaveTimeText(saveTime: number, showFullDate: boolean = false): string {
    let saveTimeText = '';
    if (showFullDate) {
      saveTimeText = `${formatDate(saveTime, 'fullDate', this.localeID)} • ${formatDate(
        saveTime,
        'shortTime',
        this.localeID
      )}`;
    } else if (this.isToday(saveTime)) {
      saveTimeText = formatDate(saveTime, 'shortTime', this.localeID);
    } else {
      saveTimeText = formatDate(saveTime, 'mediumDate', this.localeID);
    }
    return saveTimeText;
  }

  private isToday(time: number): boolean {
    return (
      formatDate(time, 'shortDate', this.localeID) ===
      formatDate(new Date(), 'shortDate', this.localeID)
    );
  }
}
