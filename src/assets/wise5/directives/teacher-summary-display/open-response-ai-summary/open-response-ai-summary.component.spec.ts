import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenResponseAiSummaryComponent } from './open-response-ai-summary.component';
import { MockComponent, MockProviders } from 'ng-mocks';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { ProjectService } from '../../../services/projectService';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { LocalStorageService } from '../../../../../app/services/localStorageService';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DataService } from '../../../../../app/services/data.service';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ChatService } from '../../../../../app/services/chat/chat.service';
import { OpenAiChatService } from '../../../../../app/services/chat/openAiChat.service';
import { OpenResponseService } from '../../../components/openResponse/openResponseService';

describe('OpenResponseAiSummaryComponent', () => {
  let component: OpenResponseAiSummaryComponent;
  let fixture: ComponentFixture<OpenResponseAiSummaryComponent>;
  let chatService: ChatService;
  let localStorageService: LocalStorageService;
  let dataService: TeacherDataService;
  let projectService: ProjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenResponseAiSummaryComponent, MockComponent(MarkdownComponent)],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DataService, useExisting: TeacherDataService },
        MockProviders(
          AnnotationService,
          ConfigService,
          CRaterService,
          LocalStorageService,
          MarkdownService,
          OpenAiChatService,
          OpenResponseService,
          TeacherProjectService,
          SummaryService,
          TeacherDataService
        )
      ]
    }).compileComponents();

    chatService = TestBed.inject(OpenAiChatService);
    localStorageService = TestBed.inject(LocalStorageService);
    dataService = TestBed.inject(TeacherDataService);
    projectService = TestBed.inject(TeacherProjectService);

    spyOn(projectService, 'getComponent').and.returnValue({
      id: 'component1',
      type: 'OpenResponse',
      prompt: 'What is your opinion on climate change?',
      ai: {
        teacherSummarySystemPrompt: 'You are a teacher summarizing student responses.'
      }
    } as any);

    fixture = TestBed.createComponent(OpenResponseAiSummaryComponent);
    component = fixture.componentInstance;
    component.nodeId = 'node1';
    component.componentId = 'component1';
    component.periodId = 1;
  });

  describe('ngOnInit', () => {
    it('should load summary from localStorage if it exists', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      const savedSummary = 'This is a saved summary';
      spyOn(localStorageService, 'getItem').and.returnValues(savedSummary, 1000);
      fixture.detectChanges();
      expect(component['summary']).toBe(savedSummary);
    });

    it('should set newSummaryAvailable to true when responses are newer than summary', () => {
      const componentStates = getComponentStates();
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(componentStates);
      const oldTimestamp = 1000;
      spyOn(localStorageService, 'getItem').and.returnValues('Old summary', oldTimestamp);
      fixture.detectChanges();
      expect(component['newSummaryAvailable']).toBe(true);
    });

    it('should set newSummaryAvailable to false when summary is newer than responses', () => {
      const componentStates = getComponentStates();
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(componentStates);
      const futureTimestamp = Date.now() + 100000;
      spyOn(localStorageService, 'getItem').and.returnValues('Recent summary', futureTimestamp);
      component.ngOnInit();
      fixture.detectChanges();
      expect(component['newSummaryAvailable']).toBe(false);
    });
  });

  describe('getLatestComponentStates', () => {
    it('should filter component states by period ID', () => {
      const componentStates = getComponentStates();
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(componentStates);
      component.periodId = 1;
      const result = component['getLatestComponentStates']();
      expect(result.every((state) => state.periodId === 1)).toBe(true);
    });

    it('should return all component states when periodId is -1', () => {
      const componentStates = [
        ...getComponentStates(),
        {
          id: 4,
          componentId: 'component1',
          nodeId: 'node1',
          periodId: 2,
          runId: 1,
          serverSaveTime: 4000,
          studentData: { response: 'Response from period 2' },
          workgroupId: 4
        }
      ];
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(componentStates);
      component.periodId = -1;
      const result = component['getLatestComponentStates']();
      expect(result.length).toBe(4);
    });

    it('should return only the latest state per workgroup', () => {
      const componentStates = [
        ...getComponentStates(),
        {
          id: 4,
          componentId: 'component1',
          nodeId: 'node1',
          periodId: 1,
          runId: 1,
          serverSaveTime: 5000,
          studentData: { response: 'Updated response from workgroup 1' },
          workgroupId: 1
        }
      ];
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(componentStates);
      component.periodId = 1;
      const result = component['getLatestComponentStates']();
      const workgroup1States = result.filter((state) => state.workgroupId === 1);
      expect(workgroup1States.length).toBe(1);
      expect(workgroup1States[0].serverSaveTime).toBe(5000);
    });
  });

  describe('generateSummary', () => {
    beforeEach(() => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call chatService with correct system prompt', async () => {
      const sendMessageSpy = spyOn(chatService, 'sendMessage').and.returnValue(
        Promise.resolve('Generated summary')
      );
      await component['generateSummary']();
      const messages = sendMessageSpy.calls.mostRecent().args[0];
      expect(messages[0].role).toBe('system');
      expect(messages[0].content).toContain('You are a teacher summarizing student responses.');
    });

    it('should call chatService with student responses', async () => {
      const sendMessageSpy = spyOn(chatService, 'sendMessage').and.returnValue(
        Promise.resolve('Generated summary')
      );
      await component['generateSummary']();
      const messages = sendMessageSpy.calls.mostRecent().args[0];
      expect(messages[1].role).toBe('user');
      expect(messages[1].content).toContain('<response>');
      expect(messages[1].content).toContain('Climate change is real');
    });

    it('should save summary to localStorage', async () => {
      const generatedSummary = 'This is a generated summary';
      spyOn(chatService, 'sendMessage').and.returnValue(Promise.resolve(generatedSummary));
      const setItemSpy = spyOn(localStorageService, 'setItem');
      await component['generateSummary']();
      expect(setItemSpy).toHaveBeenCalledWith(
        'component-summary-1-node1-component1',
        generatedSummary
      );
    });

    it('should save timestamp to localStorage', async () => {
      spyOn(chatService, 'sendMessage').and.returnValue(Promise.resolve('Generated summary'));
      const setItemSpy = spyOn(localStorageService, 'setItem');
      const beforeTime = new Date().getTime();
      await component['generateSummary']();
      const afterTime = new Date().getTime();
      const timestampCall = setItemSpy.calls.all().find((call) => call.args[0].includes('time'));
      expect(timestampCall).toBeDefined();
      expect(timestampCall.args[1]).toBeGreaterThanOrEqual(beforeTime);
      expect(timestampCall.args[1]).toBeLessThanOrEqual(afterTime);
    });

    it('should set generatingSummary to false after completion', async () => {
      spyOn(chatService, 'sendMessage').and.returnValue(Promise.resolve('Generated summary'));
      await component['generateSummary']();
      expect(component['generatingSummary']).toBe(false);
    });

    it('should set newSummaryAvailable to false after generation', async () => {
      component['newSummaryAvailable'] = true;
      spyOn(chatService, 'sendMessage').and.returnValue(Promise.resolve('Generated summary'));
      await component['generateSummary']();
      expect(component['newSummaryAvailable']).toBe(false);
    });

    it('should update summary property', async () => {
      const generatedSummary = 'This is a generated summary';
      spyOn(chatService, 'sendMessage').and.returnValue(Promise.resolve(generatedSummary));
      await component['generateSummary']();
      expect(component['summary']).toBe(generatedSummary);
    });
  });

  describe('getStudentResponses', () => {
    it('should format student responses with XML tags', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      component.ngOnInit();
      const responses = component['getStudentResponses']();
      expect(responses).toContain('<response>Climate change is real</response>');
      expect(responses).toContain('<response>We need to act now</response>');
      expect(responses).toContain('<response>Renewable energy is the future</response>');
    });

    it('should concatenate all responses', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      component.ngOnInit();
      const responses = component['getStudentResponses']();
      const responseCount = (responses.match(/<response>/g) || []).length;
      expect(responseCount).toBe(3);
    });
  });

  describe('template rendering', () => {
    it('should display generate button when hasStudentResponses is true', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      component.ngOnInit();
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
      expect(button.textContent).toContain('Generate Summary');
    });

    it('should disable generate button when generatingSummary is true', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      component.ngOnInit();
      component['generatingSummary'] = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should display "New responses since last summary" when newSummaryAvailable is true', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      const oldTimestamp = 1000;
      spyOn(localStorageService, 'getItem')
        .withArgs('component-summary-1-node1-component1')
        .and.returnValue('Old summary')
        .withArgs('component-summary-time-1-node1-component1')
        .and.returnValue(oldTimestamp);
      component.ngOnInit();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('New responses since last summary');
    });

    it('should display spinner when generatingSummary is true', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      component.ngOnInit();
      component['generatingSummary'] = true;
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('mat-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should display summary when summary exists', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      const savedSummary = 'This is a saved summary';
      spyOn(localStorageService, 'getItem')
        .withArgs('component-summary-1-node1-component1')
        .and.returnValue(savedSummary)
        .withArgs('component-summary-time-1-node1-component1')
        .and.returnValue(Date.now() + 100000);
      component.ngOnInit();
      fixture.detectChanges();
      const markdown = fixture.nativeElement.querySelector('markdown');
      expect(markdown).toBeTruthy();
    });

    it('should display response count when summary exists', () => {
      spyOn(dataService, 'getComponentStatesByComponentId').and.returnValue(getComponentStates());
      const savedSummary = 'This is a saved summary';
      spyOn(localStorageService, 'getItem')
        .withArgs('component-summary-1-node1-component1')
        .and.returnValue(savedSummary)
        .withArgs('component-summary-time-1-node1-component1')
        .and.returnValue(Date.now() + 100000);
      component.ngOnInit();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('3 responses');
    });
  });
});

function getComponentStates(): any[] {
  return [
    {
      id: 1,
      componentId: 'component1',
      nodeId: 'node1',
      periodId: 1,
      runId: 1,
      serverSaveTime: 1000,
      studentData: {
        response: 'Climate change is real'
      },
      workgroupId: 1
    },
    {
      id: 2,
      componentId: 'component1',
      nodeId: 'node1',
      periodId: 1,
      runId: 1,
      serverSaveTime: 2000,
      studentData: {
        response: 'We need to act now'
      },
      workgroupId: 2
    },
    {
      id: 3,
      componentId: 'component1',
      nodeId: 'node1',
      periodId: 1,
      runId: 1,
      serverSaveTime: 3000,
      studentData: {
        response: 'Renewable energy is the future'
      },
      workgroupId: 3
    }
  ];
}
