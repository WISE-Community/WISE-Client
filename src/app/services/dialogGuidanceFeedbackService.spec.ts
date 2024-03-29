import { TestBed } from '@angular/core/testing';
import { FeedbackRule } from '../../assets/wise5/components/common/feedbackRule/FeedbackRule';
import { DialogGuidanceFeedbackService } from '../../assets/wise5/services/dialogGuidanceFeedbackService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { DialogGuidanceComponent } from '../../assets/wise5/components/dialogGuidance/DialogGuidanceComponent';
import { DialogGuidanceContent } from '../../assets/wise5/components/dialogGuidance/DialogGuidanceContent';

let service: DialogGuidanceFeedbackService;
let studentDataService: StudentDataService;
let feedbackRuleV1: FeedbackRule;
let feedbackRuleV2_1: FeedbackRule;

class StudentDataServiceMock {
  getLatestSubmitComponentState() {}
}

const content = {} as DialogGuidanceContent;
const component = new DialogGuidanceComponent(content, 'node1');

describe('DialogGuidanceFeedbackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DialogGuidanceFeedbackService,
        { provide: StudentDataService, useClass: StudentDataServiceMock }
      ]
    });
    service = TestBed.inject(DialogGuidanceFeedbackService);
    studentDataService = TestBed.inject(StudentDataService);
    feedbackRuleV1 = new FeedbackRule();
    feedbackRuleV1.feedback = 'feedbackRuleV1';
    feedbackRuleV2_1 = new FeedbackRule();
    feedbackRuleV2_1.id = 'feedbackRuleV2_1';
    feedbackRuleV2_1.feedback = ['feedbackRuleV2_1 1', 'feedbackRuleV2_1 2'];
  });
  getFeedbackTextV1();
  getFeedbackTextV2();
});

function getFeedbackTextV1() {
  describe('getFeedbackText() in version 1 one feedbacks per each idea', () => {
    beforeEach(() => {
      spyOn(component, 'isVersion1').and.returnValue(true);
    });
    it('should return feedback in the feedback rule', () => {
      expect(service.getFeedbackText(component, feedbackRuleV1)).toEqual('feedbackRuleV1');
    });
  });
}

function getFeedbackTextV2() {
  describe('getFeedbackText() in version 2 (multiple feedbacks per same idea)', () => {
    beforeEach(() => {
      spyOn(component, 'isVersion1').and.returnValue(false);
    });
    it('should return first feedback the first time', () => {
      spyOn(studentDataService, 'getLatestSubmitComponentState').and.returnValue({
        studentData: { responses: [] }
      });
      expect(service.getFeedbackText(component, feedbackRuleV2_1)).toEqual('feedbackRuleV2_1 1');
    });
    it('should return second feedback the second time', () => {
      spyOn(studentDataService, 'getLatestSubmitComponentState').and.returnValue({
        studentData: { responses: [{ feedbackRuleId: 'feedbackRuleV2_1' }] }
      });
      expect(service.getFeedbackText(component, feedbackRuleV2_1)).toEqual('feedbackRuleV2_1 2');
    });
  });
}
