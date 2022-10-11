import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackRule } from '../../../assets/wise5/components/common/feedbackRule/FeedbackRule';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditDynamicPromptRulesComponent } from './edit-dynamic-prompt-rules.component';

let component: EditDynamicPromptRulesComponent;
let fixture: ComponentFixture<EditDynamicPromptRulesComponent>;

describe('EditDynamicPromptRulesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDynamicPromptRulesComponent],
      imports: [
        DragDropModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDynamicPromptRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  addNewRule();
  deleteRule();
});

function addNewRule() {
  describe('addNewRule()', () => {
    it('should add new prompt rule', () => {
      expect(component.feedbackRules.length).toEqual(0);
      component.addNewRule('beginning');
      expect(component.feedbackRules.length).toEqual(1);
      const newFeedbackRule = component.feedbackRules[0];
      expect(newFeedbackRule.id).not.toEqual('');
      expect(newFeedbackRule.expression).toEqual('');
      expect(newFeedbackRule.prompt).toEqual('');
    });
  });
}

function deleteRule() {
  describe('deleteRule()', () => {
    it('should delete rule at specified index', () => {
      component.feedbackRules = [new FeedbackRule()];
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteRule(0);
      expect(component.feedbackRules.length).toEqual(0);
    });
  });
}
