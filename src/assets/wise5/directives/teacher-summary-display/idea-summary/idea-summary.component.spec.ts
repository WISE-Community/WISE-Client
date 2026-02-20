import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProviders } from 'ng-mocks';
import { Observable, Subject } from 'rxjs';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { IdeaSummaryComponent } from './idea-summary.component';
import { ComponentState } from '../../../../../app/domain/componentState';
import { Annotation } from '../../../common/Annotation';
import { DataService } from '../../../../../app/services/data.service';
import { ProjectService } from '../../../services/projectService';

let component: IdeaSummaryComponent;
let fixture: ComponentFixture<IdeaSummaryComponent>;
let annotationService: AnnotationService;
let projectService: TeacherProjectService;

class MockProjectService {
  private projectSavedSource: Subject<any> = new Subject<any>();
  public readonly projectSaved$: Observable<any> = this.projectSavedSource.asObservable();
  getComponent(): any {
    return null;
  }
}

describe('IdeaSummaryComponent', () => {
  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['getCurrentNode']);
    await TestBed.configureTestingModule({
      imports: [IdeaSummaryComponent],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ProjectService, useClass: MockProjectService },
        { provide: TeacherProjectService, useClass: MockProjectService },
        MockProviders(
          AnnotationService,
          ConfigService,
          CRaterService,
          TeacherDataService,
          SummaryService
        )
      ]
    }).compileComponents();

    projectService = TestBed.inject(TeacherProjectService);
    annotationService = TestBed.inject(AnnotationService);
    fixture = TestBed.createComponent(IdeaSummaryComponent);
    component = fixture.componentInstance;

    // Set up default inputs
    component.componentId = 'component1';
    component.nodeId = 'node1';
    component.idea = {
      id: 'idea1',
      text: 'Test Idea',
      count: 5,
      color: 'red'
    };
  });

  describe('initial state', () => {
    it('should initialize with expanded as false', () => {
      expect(component['expanded']).toBe(false);
    });

    it('should initialize with empty responses array', () => {
      expect(component['responses']).toEqual([]);
    });
  });

  describe('when expanding for the first time', () => {
    beforeEach(() => {
      component['expanded'] = false;
      component['responses'] = [];
    });

    it('should not fetch responses again when already loaded', async () => {
      component['responses'] = [{ text: 'Existing response', timestamp: 123456 }];

      const getComponentSpy = spyOn(projectService, 'getComponent');
      const getLatestWorkSpy = spyOn<any>(component, 'getLatestWork');

      await component['toggleDetails']();

      expect(getComponentSpy).not.toHaveBeenCalled();
      expect(getLatestWorkSpy).not.toHaveBeenCalled();
    });
  });

  describe('getDGResponsesWithIdea()', () => {
    it('should return responses with the specified idea', () => {
      const states = [
        new ComponentState({
          workgroupId: 1,
          studentData: {
            responses: [
              { text: 'Student response 1', timestamp: 111 },
              { text: 'Computer response 1', ideas: [{ detected: true, name: 'idea1' }] }
            ]
          }
        }),
        new ComponentState({
          workgroupId: 2,
          studentData: {
            responses: [
              { text: 'Student response 2', timestamp: 222 },
              { text: 'Computer response 2', ideas: [{ detected: true, name: 'idea2' }] }
            ]
          }
        })
      ];

      const responses = component['getDGResponsesWithIdea'](states, 'idea1');
      expect(responses.length).toBe(1);
      expect(responses[0].text).toBe('Student response 1');
    });

    it('should return only one response per workgroup', () => {
      const states = [
        new ComponentState({
          workgroupId: 1,
          studentData: {
            responses: [
              { text: 'Student response 1a', timestamp: 111 },
              { text: 'Computer response 1a', ideas: [{ detected: true, name: 'idea1' }] }
            ]
          }
        }),
        new ComponentState({
          workgroupId: 1,
          studentData: {
            responses: [
              { text: 'Student response 1b', timestamp: 222 },
              { text: 'Computer response 1b', ideas: [{ detected: true, name: 'idea1' }] }
            ]
          }
        })
      ];

      const responses = component['getDGResponsesWithIdea'](states, 'idea1');
      expect(responses.length).toBe(1);
    });

    it('should return empty array when no ideas match', () => {
      const states = [
        new ComponentState({
          workgroupId: 1,
          studentData: {
            responses: [
              { text: 'Student response', timestamp: 111 },
              { text: 'Computer response', ideas: [{ detected: true, name: 'idea2' }] }
            ]
          }
        })
      ];

      const responses = component['getDGResponsesWithIdea'](states, 'idea1');
      expect(responses.length).toBe(0);
    });

    it('should skip responses where idea is not detected', () => {
      const states = [
        new ComponentState({
          workgroupId: 1,
          studentData: {
            responses: [
              { text: 'Student response', timestamp: 111 },
              { text: 'Computer response', ideas: [{ detected: false, name: 'idea1' }] }
            ]
          }
        })
      ];

      const responses = component['getDGResponsesWithIdea'](states, 'idea1');
      expect(responses.length).toBe(0);
    });
  });

  describe('getORResponsesWithIdea()', () => {
    it('should return responses with matching annotations', () => {
      const states = [
        new ComponentState({
          id: 1,
          workgroupId: 1,
          clientSaveTime: 123456,
          studentData: { response: 'Student answer 1' }
        }),
        new ComponentState({
          id: 2,
          workgroupId: 2,
          clientSaveTime: 234567,
          studentData: { response: 'Student answer 2' }
        })
      ];

      const annotations = [
        new Annotation({
          studentWorkId: 1,
          data: { ideas: [{ detected: true, name: 'idea1' }] }
        })
      ];

      spyOn(annotationService, 'getAnnotationsByNodeIdComponentId').and.returnValue(annotations);
      const responses = component['getORResponsesWithIdea'](states, 'idea1');
      expect(responses.length).toBe(1);
      expect(responses[0].text).toBe('Student answer 1');
      expect(responses[0].timestamp).toBe(123456);
    });

    it('should return empty array when no annotations match', () => {
      const states = [
        new ComponentState({
          id: 1,
          workgroupId: 1,
          clientSaveTime: 123456,
          studentData: { response: 'Student answer' }
        })
      ];

      const annotations = [
        new Annotation({
          studentWorkId: 2,
          data: { ideas: [{ detected: true, name: 'idea1' }] }
        })
      ];

      spyOn(annotationService, 'getAnnotationsByNodeIdComponentId').and.returnValue(annotations);
      const responses = component['getORResponsesWithIdea'](states, 'idea1');
      expect(responses.length).toBe(0);
    });

    it('should filter annotations by idea name and detected status', () => {
      const states = [
        new ComponentState({
          id: 1,
          workgroupId: 1,
          clientSaveTime: 123456,
          studentData: { response: 'Student answer 1' }
        }),
        new ComponentState({
          id: 2,
          workgroupId: 2,
          clientSaveTime: 234567,
          studentData: { response: 'Student answer 2' }
        })
      ];

      const annotations = [
        new Annotation({
          studentWorkId: 1,
          data: { ideas: [{ detected: true, name: 'idea1' }] }
        }),
        new Annotation({
          studentWorkId: 2,
          data: { ideas: [{ detected: false, name: 'idea1' }] }
        })
      ];

      spyOn(annotationService, 'getAnnotationsByNodeIdComponentId').and.returnValue(annotations);
      const responses = component['getORResponsesWithIdea'](states, 'idea1');
      expect(responses.length).toBe(1);
      expect(responses[0].text).toBe('Student answer 1');
    });
  });
});
