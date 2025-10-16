import { Component, EventEmitter, Output, Signal } from '@angular/core';
import { Language, TranscribeService } from '../../../services/transcribeService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'speech-to-text',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [TranscribeService],
  styleUrl: './speech-to-text.component.scss',
  templateUrl: './speech-to-text.component.html'
})
export class SpeechToTextComponent {
  protected languages: Language[] = this.transcribeService.languages;
  @Output() newTextEvent: EventEmitter<string> = new EventEmitter<string>();
  protected recording: Signal<boolean> = this.transcribeService.recording;
  protected recordingRequester = false;
  protected selectedLanguage: Signal<Language> = this.transcribeService.selectedLanguage;

  constructor(private transcribeService: TranscribeService) {}

  ngOnDestroy(): void {
    this.stopRecording();
  }

  protected toggleRecording(): void {
    if (!this.recording()) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  protected changeLanguage(language: Language): void {
    this.transcribeService.setSelectedLanguage(language);
  }

  private async startRecording(): Promise<void> {
    try {
      this.recordingRequester = true;
      await this.transcribeService.startRecording(
        this.selectedLanguage().code,
        this.processTranscriptionText.bind(this)
      );
    } catch (error) {
      alert($localize`An error occurred while recording: ${error.message}`);
      this.stopRecording();
    }
  }

  private stopRecording(): void {
    this.transcribeService.stopRecording();
    this.recordingRequester = false;
  }

  private processTranscriptionText(text: string): void {
    this.newTextEvent.emit(text);
  }
}
