import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { TeacherPresentationSelectionStore } from './teacher-presentation-selection.store';
import { TeacherPresentationConfigService } from './teacher-presentation-config.service';
import {
  DiscussionPresentationItem,
  IdeasPresentationItem,
  IdeasPresentationResponse,
  TeacherPresentationConfig
} from './teacher-presentation-config';

describe('TeacherPresentationSelectionStore', () => {
  let store: TeacherPresentationSelectionStore;
  let configServiceSpy: jasmine.SpyObj<TeacherPresentationConfigService>;

  beforeEach(() => {
    configServiceSpy = jasmine.createSpyObj('TeacherPresentationConfigService', [
      'getConfig',
      'saveConfig'
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

  describe('Discussion Selection operations', () => {
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

  describe('Discussion Config persistence', () => {
    beforeEach(() => {
      configServiceSpy.getConfig.and.returnValue(of(null));
      configServiceSpy.saveConfig.and.returnValue(of({} as TeacherPresentationConfig));
      store.init(1, 10, 'node1', 'comp1', 'Discussion', 'Discussion');
    });

    it('should populate store state when existing config is loaded on init', () => {
      const mockConfig: TeacherPresentationConfig = {
        id: 1,
        runId: 1,
        periodId: 10,
        nodeId: 'node1',
        componentId: 'comp1',
        componentType: 'Discussion',
        itemType: 'Discussion',
        items: [{ studentWorkId: 101 }, { studentWorkId: 102 }],
        studentNamesDisplay: 'anonymize',
        prompt: 'Initial prompt'
      };
      configServiceSpy.getConfig.and.returnValue(of(mockConfig));

      store.init(1, 10, 'node1', 'comp1', 'Discussion', 'Discussion');

      expect(store.selectedCount()).toBe(2);
      expect(store.isSelected(101)).toBeTrue();
      expect(store.isSelected(102)).toBeTrue();
      expect(store.studentNamesDisplay()).toBe('anonymize');
      expect(store.prompt()).toBe('Initial prompt');
    });

    it('should preserve empty string prompt when config has empty prompt', () => {
      const mockConfig: TeacherPresentationConfig = {
        id: 1,
        runId: 1,
        periodId: 10,
        nodeId: 'node1',
        componentId: 'comp1',
        componentType: 'Discussion',
        items: [],
        studentNamesDisplay: 'hide',
        prompt: ''
      };
      configServiceSpy.getConfig.and.returnValue(of(mockConfig));

      store.init(1, 10, 'node1', 'comp1', 'Discussion');

      expect(store.prompt()).toBe('');
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
      expect(payload.itemType).toBe('Discussion');
      expect(payload.items?.length).toBe(1);
      expect((payload.items?.[0] as DiscussionPresentationItem).studentWorkId).toBe(100);
    }));

    it('setPrompt should save immediately without waiting for debounce', () => {
      store.setPrompt('Custom teacher prompt');
      expect(configServiceSpy.saveConfig).toHaveBeenCalledTimes(1);
      const payload = configServiceSpy.saveConfig.calls.mostRecent().args[0];
      expect(payload.prompt).toBe('Custom teacher prompt');
    });
  });

  describe('Ideas Selection operations', () => {
    const response = (
      studentWorkId: number,
      responseTimestamp: number | null = null,
      workgroupId = 1,
      text = `text ${studentWorkId}`
    ): IdeasPresentationResponse => ({ studentWorkId, workgroupId, responseTimestamp, text });
    // Two messages from the same chat: later saves keep the same timestamps.
    const message1 = response(501, 1000);
    const message2 = response(501, 2000);

    beforeEach(() => {
      configServiceSpy.getConfig.and.returnValue(of(null));
      configServiceSpy.saveConfig.and.returnValue(of({} as TeacherPresentationConfig));
      store.init(1, 10, 'node1', 'comp1', 'OpenResponse', 'Ideas');
    });

    it('should toggle idea category selection', () => {
      expect(store.isIdeaSelected('idea_1')).toBeFalse();
      expect(store.hasSelections()).toBeFalse();

      store.toggleIdea('idea_1');
      expect(store.isIdeaSelected('idea_1')).toBeTrue();
      expect(store.hasSelections()).toBeTrue();

      store.toggleIdea('idea_1');
      expect(store.isIdeaSelected('idea_1')).toBeFalse();
      expect(store.hasSelections()).toBeFalse();
    });

    it('should automatically select idea category when a response is selected', () => {
      expect(store.isIdeaSelected('idea_1')).toBeFalse();
      expect(store.isIdeaResponseSelected('idea_1', message1)).toBeFalse();

      store.toggleIdeaResponse('idea_1', message1);
      expect(store.isIdeaSelected('idea_1')).toBeTrue();
      expect(store.isIdeaResponseSelected('idea_1', message1)).toBeTrue();
    });

    it('should select messages from the same student work independently', () => {
      store.toggleIdeaResponse('idea_1', message1);
      expect(store.isIdeaResponseSelected('idea_1', message1)).toBeTrue();
      expect(store.isIdeaResponseSelected('idea_1', message2)).toBeFalse();

      store.toggleIdeaResponse('idea_1', message2);
      expect(store.isIdeaResponseSelected('idea_1', message2)).toBeTrue();
    });

    it('should identify a chat message by workgroup and timestamp, not by student work id', () => {
      store.toggleIdeaResponse('idea_1', message1);
      // The same message seen in a later save of the chat has a different studentWorkId
      expect(store.isIdeaResponseSelected('idea_1', { ...message1, studentWorkId: 999 })).toBeTrue();
    });

    it('should retain response as standalone when idea category is unchecked', () => {
      store.toggleIdeaResponse('idea_1', message1);
      expect(store.isIdeaSelected('idea_1')).toBeTrue();

      // Uncheck idea category
      store.toggleIdea('idea_1');
      expect(store.isIdeaSelected('idea_1')).toBeFalse();
      // Response remains selected
      expect(store.isIdeaResponseSelected('idea_1', message1)).toBeTrue();
      expect(store.hasSelections()).toBeTrue();
    });

    it('should keep idea category checked when unchecking a response', () => {
      store.toggleIdea('idea_1');
      store.toggleIdeaResponse('idea_1', message1);
      expect(store.isIdeaSelected('idea_1')).toBeTrue();
      expect(store.isIdeaResponseSelected('idea_1', message1)).toBeTrue();

      // Uncheck response
      store.toggleIdeaResponse('idea_1', message1);
      expect(store.isIdeaResponseSelected('idea_1', message1)).toBeFalse();
      // Idea category remains selected
      expect(store.isIdeaSelected('idea_1')).toBeTrue();
      expect(store.hasSelections()).toBeTrue();
    });

    it('should debounce autosave by 1 second with Ideas payload structure', fakeAsync(() => {
      store.toggleIdea('idea_1');
      store.toggleIdeaResponse('idea_1', message1);
      store.toggleIdeaResponse('idea_1', message2);

      tick(1000);
      expect(configServiceSpy.saveConfig).toHaveBeenCalledTimes(1);
      const payload = configServiceSpy.saveConfig.calls.mostRecent().args[0];
      expect(payload.itemType).toBe('Ideas');
      expect(payload.items?.length).toBe(1);

      const ideaItem = payload.items?.[0] as IdeasPresentationItem;
      expect(ideaItem.ideaId).toBe('idea_1');
      expect(ideaItem.responses).toEqual([message1, message2]);
    }));

    it('should save standalone responses with ideaId: null when idea category is unchecked', fakeAsync(() => {
      store.toggleIdeaResponse('idea_1', message1);
      // Uncheck the category
      store.toggleIdea('idea_1');

      tick(1000);
      expect(configServiceSpy.saveConfig).toHaveBeenCalled();
      const payload = configServiceSpy.saveConfig.calls.mostRecent().args[0];
      expect(payload.itemType).toBe('Ideas');
      expect(payload.items?.length).toBe(1);

      const standaloneItem = payload.items?.[0] as IdeasPresentationItem;
      expect(standaloneItem.ideaId).toBeNull();
      expect(standaloneItem.responses).toEqual([message1]);
    }));

    it('should restore child responses and remove from standalone when re-selecting idea category', fakeAsync(() => {
      // 1. Select response (auto-selects idea category)
      store.toggleIdeaResponse('idea_1', message1);
      tick(1000);
      let payload = configServiceSpy.saveConfig.calls.mostRecent().args[0];
      expect(payload.items).toEqual([{ ideaId: 'idea_1', responses: [message1] }]);

      // 2. Unselect idea category (response becomes standalone)
      store.toggleIdea('idea_1');
      tick(1000);
      payload = configServiceSpy.saveConfig.calls.mostRecent().args[0];
      expect(payload.items).toEqual([{ ideaId: null, responses: [message1] }]);

      // 3. Re-select idea category (response moves back under idea_1, standalone is cleared)
      store.toggleIdea('idea_1', [message1]);
      tick(1000);
      payload = configServiceSpy.saveConfig.calls.mostRecent().args[0];
      expect(payload.items).toEqual([{ ideaId: 'idea_1', responses: [message1] }]);
    }));

    it('should load existing Ideas config into state on init', () => {
      const mockIdeasConfig: TeacherPresentationConfig = {
        id: 2,
        runId: 1,
        periodId: 10,
        nodeId: 'node1',
        componentId: 'comp1',
        componentType: 'OpenResponse',
        itemType: 'Ideas',
        items: [
          { ideaId: 'idea_1', responses: [response(601), response(602)] },
          { ideaId: null, responses: [response(701)] }
        ],
        studentNamesDisplay: 'show',
        prompt: 'Custom ideas prompt'
      };
      configServiceSpy.getConfig.and.returnValue(of(mockIdeasConfig));

      store.init(1, 10, 'node1', 'comp1', 'OpenResponse', 'Ideas');

      expect(store.itemType()).toBe('Ideas');
      expect(store.isIdeaSelected('idea_1')).toBeTrue();
      expect(store.isIdeaResponseSelected('idea_1', response(601))).toBeTrue();
      expect(store.isIdeaResponseSelected('idea_1', response(602))).toBeTrue();
      expect(store.isIdeaResponseSelected('unrelated', response(701))).toBeTrue();
      expect(store.studentNamesDisplay()).toBe('show');
      expect(store.prompt()).toBe('Custom ideas prompt');
      expect(store.hasSelections()).toBeTrue();
    });

    it('should not overwrite Ideas itemType even if an existing Discussion config was returned', () => {
      const mockDiscussionConfig: TeacherPresentationConfig = {
        id: 3,
        runId: 1,
        periodId: 10,
        nodeId: 'node1',
        componentId: 'comp1',
        componentType: 'OpenResponse',
        itemType: 'Discussion',
        items: [],
        studentNamesDisplay: 'hide',
        prompt: null
      };
      configServiceSpy.getConfig.and.returnValue(of(mockDiscussionConfig));

      store.init(1, 10, 'node1', 'comp1', 'OpenResponse', 'Ideas');

      expect(store.itemType()).toBe('Ideas');
      expect(store.hasSelections()).toBeFalse();
    });
  });
});

