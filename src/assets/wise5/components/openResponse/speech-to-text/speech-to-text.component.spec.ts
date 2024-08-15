import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeechToTextComponent } from './speech-to-text.component';
import { TranscribeService } from '../../../services/transcribeService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectService } from '../../../services/projectService';
import { ConfigService } from '../../../services/configService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SpeechToTextComponent', () => {
  let component: SpeechToTextComponent;
  let fixture: ComponentFixture<SpeechToTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule, SpeechToTextComponent],
    providers: [
        ConfigService,
        {
            provide: ProjectService,
            useValue: {
                project: { speechToText: { defaultLanguage: 'en-US', supportedLanguages: [] } }
            }
        },
        TranscribeService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
