import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TranscribeService } from '../../../services/transcribeService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { LanguageCode } from '@aws-sdk/client-transcribe-streaming';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/projectService';

interface Language {
  languageCode: string;
  language: string;
}

@Component({
  standalone: true,
  selector: 'speech-to-text',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatOptionModule, MatSelectModule],
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.scss']
})
export class SpeechToTextComponent {
  private allLanguages: Language[] = [
    { languageCode: 'zh-CN', language: $localize`Chinese (Simplified)` },
    { languageCode: 'en-US', language: $localize`English` },
    { languageCode: 'fr-FR', language: $localize`French` },
    { languageCode: 'de-DE', language: $localize`German` },
    { languageCode: 'it-IT', language: $localize`Italian` },
    { languageCode: 'ja-JP', language: $localize`Japanese` },
    { languageCode: 'ko-KR', language: $localize`Korean` },
    { languageCode: 'pt-BR', language: $localize`Portuguese (Brazilian)` },
    { languageCode: 'es-US', language: $localize`Spanish` }
  ];
  @ViewChild('inputLanguageList') inputLanguageList: MatSelect;
  protected languages: Language[];
  @Output() newTextEvent: EventEmitter<string> = new EventEmitter<string>();
  protected recording: boolean;
  protected selectedLanguageCode: LanguageCode;

  constructor(
    private projectService: ProjectService,
    private transcribeService: TranscribeService
  ) {
    const speechToText = this.projectService.project.speechToText;
    this.selectedLanguageCode = speechToText.defaultLanguage;
    const supportedLanguages = speechToText.supportedLanguages;
    this.languages = this.allLanguages.filter((language) =>
      supportedLanguages.includes(language.languageCode)
    );
  }

  ngOnDestroy(): void {
    this.stopRecording();
  }

  protected toggleRecording(): void {
    this.recording = !this.recording;
    this.inputLanguageList.disabled = this.recording;
    if (this.recording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  private async startRecording(): Promise<void> {
    try {
      await this.transcribeService.startRecording(
        this.selectedLanguageCode,
        this.processTranscriptionText.bind(this)
      );
    } catch (error) {
      alert($localize`An error occurred while recording: ${error.message}`);
      this.stopRecording();
    }
  }

  private stopRecording(): void {
    this.transcribeService.stopRecording();
  }

  private processTranscriptionText(text: string): void {
    this.newTextEvent.emit(text);
  }
}
