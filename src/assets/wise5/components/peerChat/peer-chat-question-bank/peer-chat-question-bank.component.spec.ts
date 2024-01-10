import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { PeerChatQuestionBankComponent } from './peer-chat-question-bank.component';
import { ProjectService } from '../../../services/projectService';
import { QuestionBank } from './QuestionBank';
import { ComponentContent } from '../../../common/ComponentContent';

let component: PeerChatQuestionBankComponent;
let fixture: ComponentFixture<PeerChatQuestionBankComponent>;

describe('PeerChatQuestionBankComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      declarations: [PeerChatQuestionBankComponent]
    }).compileComponents();
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({} as ComponentContent);
    fixture = TestBed.createComponent(PeerChatQuestionBankComponent);
    component = fixture.componentInstance;
    component.content = {
      componentId: 'abc',
      nodeId: 'node1',
      questionBank: new QuestionBank({ referenceComponent: {} })
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
