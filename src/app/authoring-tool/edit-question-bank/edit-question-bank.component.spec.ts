import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditQuestionBankComponent } from './edit-question-bank.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditQuestionBankComponent;
let fixture: ComponentFixture<EditQuestionBankComponent>;

describe('EditQuestionBankComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditQuestionBankComponent],
    imports: [MatCheckboxModule, StudentTeacherCommonServicesModule],
    providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionBankComponent);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });
  toggleComponent();
});

function toggleComponent() {
  describe('toggleComponent()', () => {
    it('should toggle component on when it does not exist', () => {
      expect(component.componentContent.questionBank).toBeUndefined();
      component.toggleComponent({ checked: true } as MatCheckboxChange);
      expect(component.componentContent.questionBank.enabled).toBeTrue();
    });
    it('should toggle component off', () => {
      component.toggleComponent({ checked: false } as MatCheckboxChange);
      expect(component.componentContent.questionBank.enabled).toBeFalse();
    });
  });
}
