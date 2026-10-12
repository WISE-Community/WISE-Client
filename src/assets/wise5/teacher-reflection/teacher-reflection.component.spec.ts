import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TeacherReflectionComponent } from './teacher-reflection.component';
import { TeacherReflectionService } from './teacher-reflection.service';
import { ConfigService } from '../services/configService';
import { MockProvider } from 'ng-mocks';
import { NotificationService } from '../services/notificationService';

describe('TeacherReflectionComponent', () => {
  let component: TeacherReflectionComponent;
  let fixture: ComponentFixture<TeacherReflectionComponent>;
  let mockReflectionService: jasmine.SpyObj<TeacherReflectionService>;
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    mockReflectionService = jasmine.createSpyObj('TeacherReflectionService', [
      'getQuestions',
      'saveAnswer'
    ]);
    mockReflectionService.getQuestions.and.returnValue(of([]));
    mockReflectionService.saveAnswer.and.returnValue(of({} as any));

    mockConfigService = jasmine.createSpyObj('ConfigService', ['getRunId']);
    mockConfigService.getRunId.and.returnValue(100);

    await TestBed.configureTestingModule({
      imports: [TeacherReflectionComponent],
      providers: [
        provideHttpClientTesting(),
        MockProvider(NotificationService),
        { provide: TeacherReflectionService, useValue: mockReflectionService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherReflectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nodeId', 'node1');
    fixture.componentRef.setInput('componentId', 'comp1');
    fixture.componentRef.setInput('componentType', 'Discussion');
    fixture.componentRef.setInput('periodId', 1);
    fixture.componentRef.setInput('questions', [
      { id: 'q1', text: 'Question 1 text' },
      { id: 'q2', text: 'Question 2 text' }
    ]);
  });

  it('should create and load answers on init', () => {
    mockReflectionService.getQuestions.and.returnValue(
      of([
        {
          runId: 100,
          periodId: 1,
          nodeId: 'node1',
          componentId: 'comp1',
          componentType: 'Discussion',
          questionId: 'q1',
          questionText: 'Question 1 text',
          answerText: 'Saved answer 1'
        }
      ])
    );

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(mockReflectionService.getQuestions).toHaveBeenCalledWith(100, 1, 'node1', 'comp1');
    expect(component.getAnswerText('q1')).toBe('Saved answer 1');
    expect(component.getAnswerText('q2')).toBe('');
  });

  it('should not load answers if periodId is -1 (all periods)', () => {
    fixture.componentRef.setInput('periodId', -1);
    fixture.detectChanges();

    expect(mockReflectionService.getQuestions).not.toHaveBeenCalled();
  });

  it('should debounce saving answers by 1000ms', fakeAsync(() => {
    fixture.detectChanges();

    component.onAnswerChange(component.questions()[0], 'Draft answer');
    expect(component.getAnswerText('q1')).toBe('Draft answer');
    expect(mockReflectionService.saveAnswer).not.toHaveBeenCalled();

    tick(500);
    component.onAnswerChange(component.questions()[0], 'Updated draft answer');
    expect(mockReflectionService.saveAnswer).not.toHaveBeenCalled();

    tick(1000);
    expect(mockReflectionService.saveAnswer).toHaveBeenCalledTimes(1);
    expect(mockReflectionService.saveAnswer).toHaveBeenCalledWith({
      runId: 100,
      periodId: 1,
      nodeId: 'node1',
      componentId: 'comp1',
      componentType: 'Discussion',
      questionId: 'q1',
      questionText: 'Question 1 text',
      answerText: 'Updated draft answer'
    });
  }));
});
