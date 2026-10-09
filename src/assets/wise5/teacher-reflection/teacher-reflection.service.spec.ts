import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TeacherReflectionService } from './teacher-reflection.service';
import { TeacherReflection, TeacherReflectionAnswerRequest } from './teacher-reflection.model';

describe('TeacherReflectionService', () => {
  let service: TeacherReflectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeacherReflectionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TeacherReflectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get questions with correct query params', () => {
    const mockReflections: TeacherReflection[] = [
      {
        id: 1,
        runId: 10,
        periodId: 20,
        nodeId: 'node1',
        componentId: 'comp1',
        componentType: 'Discussion',
        questionId: 'q1',
        questionText: 'Prompt 1',
        answerText: 'Answer 1'
      }
    ];

    service.getQuestions(10, 20, 'node1', 'comp1').subscribe((questions) => {
      expect(questions).toEqual(mockReflections);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === '/api/teacher/reflection' &&
        r.params.get('runId') === '10' &&
        r.params.get('periodId') === '20' &&
        r.params.get('nodeId') === 'node1' &&
        r.params.get('componentId') === 'comp1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReflections);
  });

  it('should save answer with PUT request to /answer', () => {
    const request: TeacherReflectionAnswerRequest = {
      runId: 10,
      periodId: 20,
      nodeId: 'node1',
      componentId: 'comp1',
      componentType: 'Discussion',
      questionId: 'q1',
      questionText: 'Prompt 1',
      answerText: 'New Answer'
    };

    const mockResponse: TeacherReflection = {
      id: 1,
      ...request,
      answeredByWorkgroupId: 100
    };

    service.saveAnswer(request).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/teacher/reflection/answer');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });
});
