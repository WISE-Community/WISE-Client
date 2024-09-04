import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyComponentButtonComponent } from './copy-component-button.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { CopyTranslationsService } from '../../../services/copyTranslationsService';
import { ConfigService } from '../../../services/configService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockTeacherProjectService {}
describe('CopyComponentButtonComponent', () => {
  let component: CopyComponentButtonComponent;
  let fixture: ComponentFixture<CopyComponentButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CopyComponentButtonComponent],
      providers: [
        ConfigService,
        CopyTranslationsService,
        provideHttpClient(withInterceptorsFromDi()),
        { provide: TeacherProjectService, useClass: MockTeacherProjectService }
      ]
    });
    fixture = TestBed.createComponent(CopyComponentButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
