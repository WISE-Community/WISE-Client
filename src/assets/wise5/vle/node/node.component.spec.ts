import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../services/configService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../vleProjectService';
import { NodeComponent } from './node.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { Node } from '../../common/Node';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TransitionLogic } from '../../common/TransitionLogic';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { SubmitSurveyComponent } from '../submit-survey/submit-survey.component';

let component: NodeComponent;
let fixture: ComponentFixture<NodeComponent>;

describe('NodeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(SubmitSurveyComponent)],
      imports: [NodeComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    spyOn(TestBed.inject(ConfigService), 'isRunActive').and.returnValue(true);
    spyOn(TestBed.inject(StudentDataService), 'getCurrentNode').and.returnValue({});
    spyOn(TestBed.inject(StudentDataService), 'getNodeStatusByNodeId').and.returnValue({});
    spyOn(TestBed.inject(StudentDataService), 'saveVLEEvent').and.callFake(() => {
      return Promise.resolve({});
    });
    spyOn(TestBed.inject(VLEProjectService), 'isApplicationNode').and.returnValue(true);
    spyOn(TestBed.inject(VLEProjectService), 'getNodeById').and.returnValue({ components: [] });
    spyOn(TestBed.inject(VLEProjectService), 'getNodeTitle').and.returnValue('');
    component = fixture.componentInstance;
    const node = new Node();
    node.transitionLogic = { transitions: [] } as TransitionLogic;
    component.node = node;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  isDefaultRun_ShouldNotShowSubmitSurveyButton();
  isSurveyRun();
});

function isDefaultRun_ShouldNotShowSubmitSurveyButton() {
  describe('isDefaultRun', () => {
    beforeEach(() => {
      component['isSurvey'] = false;
      fixture.detectChanges();
    });
    it('should not show submit survey button', () => {
      expect(fixture.debugElement.query(By.css('submit-survey'))).toBeNull();
    });
  });
}

function isSurveyRun() {
  describe('isSurveyRun', () => {
    beforeEach(() => {
      component['isSurvey'] = true;
      component['isBranchNode'] = false;
    });
    describe('is last step in the unit', () => {
      beforeEach(() => {
        component['nextNodeId'] = null;
        fixture.detectChanges();
      });
      it('should show submit survey button', () => {
        expect(fixture.debugElement.query(By.css('submit-survey'))).not.toBeNull();
      });
    });
    describe('is not the last step in the unit', () => {
      beforeEach(() => {
        component['nextNodeId'] = 'nextNodeId';
        fixture.detectChanges();
      });
      it('should not show submit survey button', () => {
        expect(fixture.debugElement.query(By.css('submit-survey'))).toBeNull();
      });
    });
  });
}
