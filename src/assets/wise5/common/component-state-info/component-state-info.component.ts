import { Component, Input } from '@angular/core';
import { ConfigService } from '../../services/configService';

@Component({
  selector: 'component-state-info',
  templateUrl: 'component-state-info.component.html'
})
export class ComponentStateInfoComponent {
  @Input() componentState: any;
  @Input() isInactive: boolean;

  latestComponentStateTime: number;

  constructor(private ConfigService: ConfigService) {}

  ngOnChanges() {
    this.latestComponentStateTime = this.ConfigService.convertToClientTimestamp(
      this.componentState.serverSaveTime
    );
  }
}
