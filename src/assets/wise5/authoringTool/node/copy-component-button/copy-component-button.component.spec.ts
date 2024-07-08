import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyComponentButtonComponent } from './copy-component-button.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatIconModule } from '@angular/material/icon';
import { CopyTranslationsService } from '../../../services/copyTranslationsService';
import { ConfigService } from '../../../services/configService';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockTeacherProjectService {}
describe('CopyComponentButtonComponent', () => {
  let component: CopyComponentButtonComponent;
  let fixture: ComponentFixture<CopyComponentButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyComponentButtonComponent],
      imports: [HttpClientTestingModule, MatIconModule],
      providers: [
        ConfigService,
        CopyTranslationsService,
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
