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

  describe('Selection rules', () => {
    it('checking a parent post should only select the parent', () => {
      store.toggleParent(100, [101, 102]);

      expect(store.isSelected(100)).toBeTrue();
      expect(store.isSelected(101)).toBeFalse();
      expect(store.isSelected(102)).toBeFalse();
      expect(store.selectedCount()).toBe(1);
      expect(store.hasSelections()).toBeTrue();
    });

    it('unchecking the parent should uncheck the parent and all child comments', () => {
      // First select parent and one comment
      store.toggleParent(100, [101, 102]);
      store.toggleComment(101, 100);
      expect(store.selectedCount()).toBe(2);

      // Now uncheck parent
      store.toggleParent(100, [101, 102]);
      expect(store.isSelected(100)).toBeFalse();
      expect(store.isSelected(101)).toBeFalse();
      expect(store.selectedCount()).toBe(0);
      expect(store.hasSelections()).toBeFalse();
    });

    it('selecting a comment should automatically select and lock the parent', () => {
      store.toggleComment(201, 200);

      expect(store.isSelected(201)).toBeTrue();
      expect(store.isSelected(200)).toBeTrue();
      expect(store.isParentLockedByComments([201])).toBeTrue();
      expect(store.selectedCount()).toBe(2);
    });

    it('unchecking a comment should remove it and unlock parent if no other comments selected', () => {
      store.toggleComment(201, 200);
      expect(store.isParentLockedByComments([201])).toBeTrue();

      store.toggleComment(201, 200);
      expect(store.isSelected(201)).toBeFalse();
      expect(store.isSelected(200)).toBeTrue(); // Parent remains selected
      expect(store.isParentLockedByComments([201])).toBeFalse();
    });
  });

  describe('Config persistence', () => {
    beforeEach(() => {
      configServiceSpy.saveConfig.and.returnValue(of({} as TeacherPresentationConfig));
      store.init(1, 10, 'node1', 'comp1', 'Discussion', []);
    });

    it('should debounce autosave by 1 second when toggling items', fakeAsync(() => {
      store.toggleParent(100);
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
