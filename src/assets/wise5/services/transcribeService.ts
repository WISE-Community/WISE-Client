import { Injectable, WritableSignal, signal } from '@angular/core';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import {
  AudioStream,
  LanguageCode,
  TranscribeStreamingClient
} from '@aws-sdk/client-transcribe-streaming';
import MicrophoneStream from 'microphone-stream';
import { StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';
import { Buffer } from 'buffer';
import * as process from 'process';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';

window.process = process;
// @ts-ignore
window.Buffer = Buffer;

export interface Language {
  languageCode: LanguageCode;
  language: string;
}

@Injectable()
export class TranscribeService {
  private SAMPLE_RATE = 44100;

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
  readonly languages: Language[];
  private microphoneStream = undefined;
  private recordingSignal: WritableSignal<boolean> = signal(false);
  readonly recording = this.recordingSignal.asReadonly();
  private selectedLanguageSignal: WritableSignal<Language> = signal({
    languageCode: null,
    language: null
  });
  readonly selectedLanguage = this.selectedLanguageSignal.asReadonly();
  private transcribeClient = undefined;

  constructor(private configService: ConfigService, private projectService: ProjectService) {
    const { defaultLanguage, supportedLanguages } = this.projectService.project.speechToText;
    this.selectedLanguageSignal.set({
      languageCode: defaultLanguage,
      language: this.allLanguages.find((language) => language.languageCode === defaultLanguage)
        .language
    });
    this.languages = this.allLanguages.filter((language) =>
      supportedLanguages.includes(language.languageCode)
    );
  }

  async startRecording(
    languageCode: LanguageCode,
    callback: (text: string) => void
  ): Promise<void> {
    if (this.microphoneStream || this.transcribeClient) {
      this.stopRecording();
    }
    this.createTranscribeClient();
    this.createMicrophoneStream();
    return await this.startStreaming(languageCode, callback);
  }

  stopRecording(): void {
    if (this.microphoneStream) {
      this.microphoneStream.stop();
      this.microphoneStream.destroy();
      this.microphoneStream = undefined;
    }
    if (this.transcribeClient) {
      this.transcribeClient.destroy();
      this.transcribeClient = undefined;
    }
    this.recordingSignal.set(false);
  }

  private createTranscribeClient(): void {
    const awsRegion = this.configService.getConfigParam('speechToTextAWSRegion');
    this.transcribeClient = new TranscribeStreamingClient({
      region: awsRegion,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: awsRegion }),
        identityPoolId: this.configService.getConfigParam('speechToTextAWSIdentityPoolId')
      })
    });
  }

  private async createMicrophoneStream(): Promise<void> {
    this.microphoneStream = new MicrophoneStream();
    this.microphoneStream.setStream(
      await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      })
    );
  }

  private async startStreaming(
    languageCode: LanguageCode,
    callback: (text: string) => void
  ): Promise<void> {
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: languageCode,
      MediaEncoding: 'pcm',
      MediaSampleRateHertz: this.SAMPLE_RATE,
      AudioStream: this.getAudioStream()
    });
    this.recordingSignal.set(true);
    const data = await this.transcribeClient.send(command);
    for await (const event of data.TranscriptResultStream) {
      for (const result of event.TranscriptEvent.Transcript.Results || []) {
        if (result.IsPartial === false) {
          const noOfResults = result.Alternatives[0].Items.length;
          for (let i = 0; i < noOfResults; i++) {
            let text = result.Alternatives[0].Items[i].Content;
            if (![',', '.', '?', '!', ':', ';'].includes(text)) {
              text = ' ' + text;
            }
            callback(text);
          }
        }
      }
    }
  }

  private async *getAudioStream(): AsyncIterable<AudioStream> {
    for await (const chunk of this.microphoneStream) {
      if (chunk.length <= this.SAMPLE_RATE) {
        yield {
          AudioEvent: {
            AudioChunk: this.encodePCMChunk(chunk)
          }
        };
      }
    }
  }

  private encodePCMChunk(chunk: Buffer): Buffer {
    const input = MicrophoneStream.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
  }

  setSelectedLanguage(language: Language): void {
    this.selectedLanguageSignal.set(language);
  }
}
