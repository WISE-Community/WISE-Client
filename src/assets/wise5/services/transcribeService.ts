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
  code: LanguageCode;
  name: string;
}

@Injectable()
export class TranscribeService {
  private SAMPLE_RATE = 44100;

  private allLanguages: Language[] = [
    { code: 'zh-CN', name: $localize`Chinese (Simplified)` },
    { code: 'en-US', name: $localize`English` },
    { code: 'fr-FR', name: $localize`French` },
    { code: 'de-DE', name: $localize`German` },
    { code: 'it-IT', name: $localize`Italian` },
    { code: 'ja-JP', name: $localize`Japanese` },
    { code: 'ko-KR', name: $localize`Korean` },
    { code: 'pt-BR', name: $localize`Portuguese (Brazilian)` },
    { code: 'es-US', name: $localize`Spanish` }
  ];
  readonly languages: Language[];
  private microphoneStream = undefined;
  private recordingSignal: WritableSignal<boolean> = signal(false);
  readonly recording = this.recordingSignal.asReadonly();
  private selectedLanguageSignal: WritableSignal<Language> = signal({
    code: null,
    name: null
  });
  readonly selectedLanguage = this.selectedLanguageSignal.asReadonly();
  private transcribeClient: TranscribeStreamingClient = undefined;

  constructor(private configService: ConfigService, private projectService: ProjectService) {
    const { defaultLanguage, supportedLanguages } = this.projectService.project.speechToText;
    this.selectedLanguageSignal.set({
      code: defaultLanguage,
      name: this.allLanguages.find((language) => language.code === defaultLanguage).name
    });
    this.languages = this.allLanguages.filter((language) =>
      supportedLanguages.includes(language.code)
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
      this.processTranscriptResultStreamEvent(event, callback);
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

  private processTranscriptResultStreamEvent(event: any, callback: (text: string) => void): void {
    for (const result of event.TranscriptEvent.Transcript.Results || []) {
      if (result.IsPartial === false) {
        this.processTranscriptResult(result, callback);
      }
    }
  }

  private processTranscriptResult(result: any, callback: (text: string) => void): void {
    const noOfResults = result.Alternatives[0].Items.length;
    for (let i = 0; i < noOfResults; i++) {
      let text = result.Alternatives[0].Items[i].Content;
      if (![',', '.', '?', '!', ':', ';'].includes(text)) {
        text = ' ' + text;
      }
      callback(text);
    }
  }

  setSelectedLanguage(language: Language): void {
    this.selectedLanguageSignal.set(language);
  }
}
