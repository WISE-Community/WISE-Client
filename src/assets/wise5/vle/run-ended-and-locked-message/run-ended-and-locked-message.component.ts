import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [FlexLayoutModule, MatIconModule],
  selector: 'run-ended-and-locked-message',
  standalone: true,
  templateUrl: './run-ended-and-locked-message.component.html'
})
export class RunEndedAndLockedMessageComponent implements OnInit {
  protected message: string;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    const endDate = this.configService.getPrettyEndDate();
    this.message = $localize`This unit ended on ${endDate}. You can no longer save new work.`;
  }
}
