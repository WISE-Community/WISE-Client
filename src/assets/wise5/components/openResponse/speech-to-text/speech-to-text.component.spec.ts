import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeechToTextComponent } from './speech-to-text.component';
import { TranscribeService } from '../../../services/transcribeService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectService } from '../../../services/projectService';
import { ConfigService } from '../../../services/configService';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SpeechToTextComponent', () => {
  let component: SpeechToTextComponent;
  let fixture: ComponentFixture<SpeechToTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, SpeechToTextComponent],
      providers: [
        ConfigService,
        {
          provide: ProjectService,
          useValue: {
            project: { speechToText: { defaultLanguage: 'en-US', supportedLanguages: [] } }
          }
        },
        TranscribeService
      ]
    });
    fixture = TestBed.createComponent(SpeechToTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
