import { Component, Input } from '@angular/core';
import { UtilService } from '../../services/utilService';

@Component({
  selector: 'save-time-message',
  styleUrls: ['save-time-message.component.scss'],
  templateUrl: 'save-time-message.component.html'
})
export class SaveTimeMessageComponent {
  @Input() isInactive: boolean;
  @Input() isAutoSave: boolean;
  @Input() isSubmit: boolean;
  @Input() saveTime: number;
  @Input() timeOnly: boolean;
  @Input() tooltipPosition: 'left' | 'right' | 'above' | 'below' | 'before' | 'after';

  message: string;
  tooltip: string;

  constructor(private UtilService: UtilService) {}

  ngOnChanges() {
    this.tooltip = this.UtilService.getSaveTimeText(this.saveTime, true);
    if (this.timeOnly) {
      this.message = this.UtilService.getSaveTimeText(this.saveTime, this.isInactive);
    } else if (this.isSubmit) {
      this.message = this.UtilService.getSubmittedMessage(this.saveTime, this.isInactive);
    } else if (this.isAutoSave) {
      this.message = this.UtilService.getSubmittedMessage(this.saveTime, this.isInactive);
    } else {
      this.message = this.UtilService.getSavedMessage(this.saveTime, this.isInactive);
    }
  }
}
