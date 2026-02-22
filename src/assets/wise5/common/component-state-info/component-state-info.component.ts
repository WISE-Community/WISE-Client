import { Component, Input } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { SaveTimeMessageComponent } from '../save-time-message/save-time-message.component';

@Component({
  imports: [SaveTimeMessageComponent],
  selector: 'component-state-info',
  template: `
    <save-time-message
      [isInactive]="isInactive"
      [isAutoSave]="componentState.isAutoSave"
      [isSubmit]="componentState.isSubmit"
      [saveTime]="latestComponentStateTime"
    />
  `
})
export class ComponentStateInfoComponent {
  @Input() componentState: any;
  @Input() isInactive: boolean;
  protected latestComponentStateTime: number;

  constructor(private configService: ConfigService) {}

  ngOnChanges(): void {
    this.latestComponentStateTime = this.configService.convertToClientTimestamp(
      this.componentState.serverSaveTime
    );
  }
}
