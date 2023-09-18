import { Component, Input } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { RxStomp } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { TeacherProjectService } from '../../services/teacherProjectService';

@Component({
  selector: 'concurrent-authors-message',
  templateUrl: 'concurrent-authors-message.component.html'
})
export class ConcurrentAuthorsMessageComponent {
  protected message: string = '';
  private myUsername: string;
  @Input() private projectId: number;
  private rxStomp: RxStomp = new RxStomp();

  constructor(private configService: ConfigService, private projectService: TeacherProjectService) {
    this.myUsername = this.configService.getMyUsername();
    this.rxStomp.configure({
      brokerURL: this.configService.getWebSocketURL()
    });
  }

  ngOnInit() {
    this.rxStomp.activate();
    this.rxStomp.connected$.subscribe(() => {
      this.projectService.notifyAuthorProjectBegin(this.projectId);
    });
    this.subscribeToCurrentAuthors();
  }

  private subscribeToCurrentAuthors(): void {
    this.rxStomp.watch(`/topic/current-authors/${this.projectId}`).subscribe((message: Message) => {
      const otherAuthors = JSON.parse(message.body).filter((author) => author != this.myUsername);
      this.message =
        otherAuthors.length > 0
          ? $localize`Also currently editing this unit: ${otherAuthors.join(
              ', '
            )}. Be careful not to overwrite each other's work!`
          : '';
    });
  }

  ngOnDestroy(): void {
    this.rxStomp.deactivate();
  }
}
