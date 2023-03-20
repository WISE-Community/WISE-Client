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

  ngOnChanges() {
    this.tooltip = this.getSaveTimeText(this.saveTime, true);
    if (this.timeOnly) {
      this.message = this.getSaveTimeText(this.saveTime, this.isInactive);
    } else if (this.isSubmit) {
      this.message = this.getSubmittedMessage(this.saveTime, this.isInactive);
    } else if (this.isAutoSave) {
      this.message = this.getAutoSavedMessage(this.saveTime, this.isInactive);
    } else {
      this.message = this.getSavedMessage(this.saveTime, this.isInactive);
    }
  }

  private getSavedMessage(clientSaveTime: number, showFullDate: boolean): string {
    return this.getMessageText('Saved', clientSaveTime, showFullDate);
  }

  private getAutoSavedMessage(clientSaveTime: number, showFullDate: boolean): string {
    return this.getMessageText('Auto Saved', clientSaveTime, showFullDate);
  }

  private getSubmittedMessage(clientSaveTime: number, showFullDate: boolean): string {
    return this.getMessageText('Submitted', clientSaveTime, showFullDate);
  }

  private getMessageText(
    prefix: string,
    clientSaveTime: number,
    showFullDate: boolean = false
  ): string {
    const saveTimeText = this.getSaveTimeText(clientSaveTime, showFullDate);
    return $localize`${prefix} ${saveTimeText}:saveTime:`;
  }

  private getSaveTimeText(saveTime: number, showFullDate: boolean = false): string {
    const now = new Date();
    let saveTimeText = '';
    if (showFullDate) {
      saveTimeText = `${formatDate(saveTime, 'fullDate', this.localeID)} • ${formatDate(
        saveTime,
        'shortTime',
        this.localeID
      )}`;
    } else if (this.isSameDay(now, saveTime)) {
      saveTimeText = formatDate(saveTime, 'shortTime', this.localeID);
    } else {
      saveTimeText = formatDate(saveTime, 'mediumDate', this.localeID);
    }
    return saveTimeText;
  }

  private isSameDay(a: string | number | Date, b: string | number | Date): boolean {
    return formatDate(a, 'shortDate', this.localeID) === formatDate(b, 'shortDate', this.localeID);
  }
}
