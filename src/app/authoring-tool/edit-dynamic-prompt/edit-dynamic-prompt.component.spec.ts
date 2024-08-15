import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditDynamicPromptComponent } from './edit-dynamic-prompt.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditDynamicPromptComponent;
let fixture: ComponentFixture<EditDynamicPromptComponent>;

describe('EditDynamicPromptComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditDynamicPromptComponent],
    imports: [MatCheckboxModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDynamicPromptComponent);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  toggleDynamicPrompt();
});

function toggleDynamicPrompt() {
  describe('toggleDynamicPrompt()', () => {
    it('should toggle dynamic prompt on when it does not exist', () => {
      expect(component.componentContent.dynamicPrompt).toBeUndefined();
      callToggleDynamicPrompt(true);
      expect(component.componentContent.dynamicPrompt.enabled).toBeTrue();
    });

    it('should toggle dynamic prompt off', () => {
      callToggleDynamicPrompt(false);
      expect(component.componentContent.dynamicPrompt.enabled).toBeFalse();
    });
  });
}

function callToggleDynamicPrompt(checked: boolean): void {
  const event = new MatCheckboxChange();
  event.checked = checked;
  component.toggleDynamicPrompt(event);
}
