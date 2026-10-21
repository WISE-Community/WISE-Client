import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../services/notificationService';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatProgressSpinnerModule],
  selector: 'save-indicator',
  styles: ['.global-message { margin-right: 20px }'],
  templateUrl: './save-indicator.component.html'
})
export class SaveIndicatorComponent {
  private notificationService = inject(NotificationService);

  protected readonly globalMessage = toSignal(
    this.notificationService.setGlobalMessage$.pipe(map((data) => data?.globalMessage ?? {})),
    { initialValue: {} }
  );
}

