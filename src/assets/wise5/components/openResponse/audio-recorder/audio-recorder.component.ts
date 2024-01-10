import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AudioRecorderService } from '../../../services/audioRecorderService';

class Attachment {
  type: string;
  url: string;
}

@Component({
  selector: 'audio-recorder',
  templateUrl: './audio-recorder.component.html'
})
export class AudioRecorderComponent implements OnInit {
  @Output() attachAudioRecording: EventEmitter<Attachment> = new EventEmitter<Attachment>();
  @Input() audioAttachments: Attachment[] = [];
  @Input() componentId: string;
  @Input() nodeId: string;
  recording: boolean;
  recordingInterval: number;
  recordingMaxTime: number = 60000;
  recordingStartTime: number = 0;
  @Output() removeAttachment: EventEmitter<Attachment> = new EventEmitter<Attachment>();
  subscriptions: Subscription = new Subscription();

  constructor(
    private audioRecorderService: AudioRecorderService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.audioRecorderService.audioRecorded$.subscribe(({ requester, audioFile }) => {
        if (requester === `${this.nodeId}-${this.componentId}`) {
          this.attachAudioRecording.emit(audioFile);
        }
      })
    );
  }

  ngOnChanges(): void {
    this.audioAttachments.map((attachment) => {
      attachment.url = attachment.url;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  stopRecording(): void {
    this.audioRecorderService.stopRecording();
    this.recording = false;
    clearInterval(this.recordingInterval);
  }

  private getTimeElapsed(): number {
    return new Date().getTime() - this.recordingStartTime;
  }

  getTimeRemaining(): number {
    return Math.floor((this.recordingMaxTime - this.getTimeElapsed()) / 1000);
  }

  removeAudioAttachment(attachment: Attachment): void {
    if (confirm($localize`Are you sure you want to delete your recording?`)) {
      this.removeAttachment.emit(attachment);
    }
  }

  startRecording(): void {
    if (this.audioAttachments.length > 0) {
      if (confirm($localize`This will replace your existing recording. Is this OK?`)) {
        this.removeAllAudioAttachments();
      } else {
        return;
      }
    }
    this.audioRecorderService.startRecording(`${this.nodeId}-${this.componentId}`);
    this.startCountdown();
    this.recording = true;
  }

  private removeAllAudioAttachments(): void {
    this.audioAttachments.forEach((attachment) => {
      this.removeAttachment.emit(attachment);
    });
  }

  private startCountdown(): void {
    this.recordingStartTime = new Date().getTime();
    this.recordingInterval = window.setInterval(() => {
      if (this.getTimeRemaining() <= 0) {
        this.stopRecording();
      }
    }, 500);
  }
}
