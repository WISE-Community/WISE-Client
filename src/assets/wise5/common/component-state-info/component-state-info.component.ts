import { Component, Input } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { SaveTimeMessageComponent } from '../save-time-message/save-time-message.component';

@Component({
  imports: [SaveTimeMessageComponent],
  selector: 'component-state-info',
  standalone: true,
  templateUrl: 'component-state-info.component.html'
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
