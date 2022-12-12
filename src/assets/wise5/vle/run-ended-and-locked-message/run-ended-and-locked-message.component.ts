import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/configService';

@Component({
  selector: 'run-ended-and-locked-message',
  templateUrl: './run-ended-and-locked-message.component.html'
})
export class RunEndedAndLockedMessageComponent implements OnInit {
  message: string;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    const endDate = this.configService.getPrettyEndDate();
    this.message = $localize`This unit ended on ${endDate}. You can no longer save new work.`;
  }
}
