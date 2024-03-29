import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyComponentButtonComponent } from './copy-component-button.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatIconModule } from '@angular/material/icon';

class MockTeacherProjectService {}
describe('CopyComponentButtonComponent', () => {
  let component: CopyComponentButtonComponent;
  let fixture: ComponentFixture<CopyComponentButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyComponentButtonComponent],
      imports: [MatIconModule],
      providers: [{ provide: TeacherProjectService, useClass: MockTeacherProjectService }]
    });
    fixture = TestBed.createComponent(CopyComponentButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
