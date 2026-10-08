import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { TeacherPresentationSelectionStore } from './teacher-presentation-selection.store';
import { TeacherPresentationConfigService } from './teacher-presentation-config.service';
import { TeacherPresentationConfig } from './teacher-presentation-config';

describe('TeacherPresentationSelectionStore', () => {
  let store: TeacherPresentationSelectionStore;
  let configServiceSpy: jasmine.SpyObj<TeacherPresentationConfigService>;

  beforeEach(() => {
    configServiceSpy = jasmine.createSpyObj('TeacherPresentationConfigService', [
      'getConfig',
      'saveConfig',
      'saveAnswer'
    ]);
    configServiceSpy.getConfig.and.returnValue(of(null));
    configServiceSpy.saveConfig.and.returnValue(of({} as TeacherPresentationConfig));

    TestBed.configureTestingModule({
      providers: [
        TeacherPresentationSelectionStore,
        { provide: TeacherPresentationConfigService, useValue: configServiceSpy }
      ]
    });

    store = TestBed.inject(TeacherPresentationSelectionStore);
  });

  it('should initialize with default values', () => {
    expect(store.selectedCount()).toBe(0);
    expect(store.hasSelections()).toBeFalse();
    expect(store.studentNamesDisplay()).toBe('hide');
    expect(store.prompt()).toBeNull();
  });

  describe('Selection operations', () => {
    it('should select and deselect items', () => {
      store.select(100);
      expect(store.isSelected(100)).toBeTrue();
      expect(store.selectedCount()).toBe(1);
      expect(store.hasSelections()).toBeTrue();

      store.deselect(100);
      expect(store.isSelected(100)).toBeFalse();
      expect(store.selectedCount()).toBe(0);
      expect(store.hasSelections()).toBeFalse();
    });

    it('should toggle item selection state', () => {
      store.toggle(100);
      expect(store.isSelected(100)).toBeTrue();

      store.toggle(100);
      expect(store.isSelected(100)).toBeFalse();
    });

    it('should select and deselect multiple items', () => {
      store.selectMultiple([100, 101, 102]);
      expect(store.isSelected(100)).toBeTrue();
      expect(store.isSelected(101)).toBeTrue();
      expect(store.isSelected(102)).toBeTrue();
      expect(store.selectedCount()).toBe(3);

      store.deselectMultiple([100, 102]);
      expect(store.isSelected(100)).toBeFalse();
      expect(store.isSelected(101)).toBeTrue();
      expect(store.isSelected(102)).toBeFalse();
      expect(store.selectedCount()).toBe(1);
    });

    it('should set and clear selections', () => {
      store.setSelections([200, 201]);
      expect(store.selectedCount()).toBe(2);
      expect(store.isSelected(200)).toBeTrue();
      expect(store.isSelected(201)).toBeTrue();

      store.clearSelections();
      expect(store.selectedCount()).toBe(0);
      expect(store.hasSelections()).toBeFalse();
    });
  });

  describe('Config persistence', () => {
    beforeEach(() => {
      configServiceSpy.getConfig.and.returnValue(of(null));
      configServiceSpy.saveConfig.and.returnValue(of({} as TeacherPresentationConfig));
      store.init(1, 10, 'node1', 'comp1', 'Discussion', []);
    });

    it('should populate store state when existing config is loaded on init', () => {
      const mockConfig: TeacherPresentationConfig = {
        id: 1,
        runId: 1,
        periodId: 10,
        nodeId: 'node1',
        componentId: 'comp1',
        componentType: 'Discussion',
        items: [{ studentWorkId: 101 }, { studentWorkId: 102 }],
        studentNamesDisplay: 'anonymize',
        prompt: 'Initial prompt',
        answers: [
          {
            questionId: 'q1',
            questionText: 'Why?',
            answerText: 'Because',
            updatedAt: 1000
          }
        ]
      };
      configServiceSpy.getConfig.and.returnValue(of(mockConfig));

      store.init(1, 10, 'node1', 'comp1', 'Discussion', []);

      expect(store.selectedCount()).toBe(2);
      expect(store.isSelected(101)).toBeTrue();
      expect(store.isSelected(102)).toBeTrue();
      expect(store.studentNamesDisplay()).toBe('anonymize');
      expect(store.prompt()).toBe('Initial prompt');
      expect(store.reflectionAnswers().get('q1')?.answerText).toBe('Because');
    });

    it('should debounce autosave by 1 second when selecting items', fakeAsync(() => {
      store.select(100);
      expect(configServiceSpy.saveConfig).not.toHaveBeenCalled();

      tick(500);
      expect(configServiceSpy.saveConfig).not.toHaveBeenCalled();

      tick(500);
      expect(configServiceSpy.saveConfig).toHaveBeenCalledTimes(1);
      const payload = configServiceSpy.saveConfig.calls.mostRecent().args[0];
      expect(payload.runId).toBe(1);
      expect(payload.periodId).toBe(10);
      expect(payload.items?.length).toBe(1);
      expect(payload.items?.[0].studentWorkId).toBe(100);
    }));

    it('setPrompt should save immediately without waiting for debounce', () => {
      store.setPrompt('Custom teacher prompt');
      expect(configServiceSpy.saveConfig).toHaveBeenCalledTimes(1);
      const payload = configServiceSpy.saveConfig.calls.mostRecent().args[0];
      expect(payload.prompt).toBe('Custom teacher prompt');
    });

    it('should save reflection answer via API and update state', () => {
      const mockAnswer = {
        questionId: 'q1',
        questionText: 'Why?',
        answerText: 'Because of reasons',
        updatedAt: 12345
      };
      configServiceSpy.saveAnswer.and.returnValue(of(mockAnswer));

      store.saveReflectionAnswer('q1', 'Why?', 'Because of reasons');

      expect(configServiceSpy.saveAnswer).toHaveBeenCalledWith({
        runId: 1,
        periodId: 10,
        nodeId: 'node1',
        componentId: 'comp1',
        componentType: 'Discussion',
        questionId: 'q1',
        questionText: 'Why?',
        answerText: 'Because of reasons'
      });
      expect(store.reflectionAnswers().get('q1')?.answerText).toBe('Because of reasons');
    });
  });
});
