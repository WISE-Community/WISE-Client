import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrentAuthorsMessageComponent } from './concurrent-authors-message.component';
import { ConfigService } from '../../services/configService';
import { By } from '@angular/platform-browser';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { of } from 'rxjs';
import { SessionService } from '../../services/sessionService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockConfigService {
  getMyUsername(): string {
    return 'aa';
  }
  getWebSocketURL(): string {
    return '/websocket';
  }
}

class MockTeacherProjectService {}

let component: ConcurrentAuthorsMessageComponent;
let fixture: ComponentFixture<ConcurrentAuthorsMessageComponent>;
describe('ConcurrentAuthorsMessageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ConcurrentAuthorsMessageComponent],
    imports: [],
    providers: [
        { provide: ConfigService, useClass: MockConfigService },
        SessionService,
        { provide: TeacherProjectService, useClass: MockTeacherProjectService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    fixture = TestBed.createComponent(ConcurrentAuthorsMessageComponent);
    component = fixture.componentInstance;
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('set empty message when there are no other authors', () => {
      expectMessage('["aa"]', '');
    });
    it('set message to author when there is one other author', () => {
      expectMessage(
        '["aa","bb"]',
        "Also currently editing this unit: bb. Be careful not to overwrite each other's work!"
      );
    });
    it('set message to comma-separated authors when there are two or more other authors', () => {
      expectMessage(
        '["aa","bb","cc"]',
        "Also currently editing this unit: bb, cc. Be careful not to overwrite each other's work!"
      );
    });
  });
}

function expectMessage(authors: string, message: string) {
  const spy = spyOn<any>(component['rxStomp'], 'watch').and.returnValue(of({ body: authors }));
  component.ngOnInit();
  fixture.detectChanges();
  expect(fixture.debugElement.query(By.css('b')).nativeElement.innerHTML).toEqual(message);
  expect(spy).toHaveBeenCalled();
}
