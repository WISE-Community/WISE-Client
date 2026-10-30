import { IdeasSelectionState } from './ideas-selection-state';
import { IdeasPresentationResponse } from '../models/teacher-presentation-config';

describe('IdeasSelectionState', () => {
  let state: IdeasSelectionState;

  const response1: IdeasPresentationResponse = {
    studentWorkId: 101,
    workgroupId: 1,
    responseTimestamp: 1000,
    text: 'Idea 1 response A'
  };

  const response2: IdeasPresentationResponse = {
    studentWorkId: 102,
    workgroupId: 2,
    responseTimestamp: 2000,
    text: 'Idea 1 response B'
  };

  beforeEach(() => {
    state = new IdeasSelectionState();
  });

  it('initializes with empty ideas selection', () => {
    expect(state.hasSelections()).toBeFalse();
    expect(state.selectedIdeaIds().size).toBe(0);
    expect(state.selectedIdeaResponseMap().size).toBe(0);
    expect(state.standaloneResponses().size).toBe(0);
  });

  it('toggles idea category selection', () => {
    expect(state.isIdeaSelected('idea 1')).toBeFalse();

    state.toggleIdea('idea 1');
    expect(state.isIdeaSelected('idea 1')).toBeTrue();
    expect(state.hasSelections()).toBeTrue();

    state.toggleIdea('idea 1');
    expect(state.isIdeaSelected('idea 1')).toBeFalse();
    expect(state.hasSelections()).toBeFalse();
  });

  it('unchecking a category preserves its responses as standalone only for that category', () => {
    state.toggleIdeaResponse('idea 1', response1);
    expect(state.isIdeaSelected('idea 1')).toBeTrue();
    expect(state.isIdeaResponseSelected('idea 1', response1)).toBeTrue();
    expect(state.isIdeaResponseSelected('idea 2', response1)).toBeFalse();

    // Uncheck category
    state.toggleIdea('idea 1');
    expect(state.isIdeaSelected('idea 1')).toBeFalse();
    // Response remains selected in idea 1, but not in other unselected categories
    expect(state.isIdeaResponseSelected('idea 1', response1)).toBeTrue();
    expect(state.isIdeaResponseSelected('idea 2', response1)).toBeFalse();
    expect(state.standaloneResponses().size).toBe(1);

    // Checking another category containing the same response does not adopt it from idea 1
    state.toggleIdea('idea 2', [response1]);
    expect(state.isIdeaSelected('idea 2')).toBeTrue();
    expect(state.isIdeaResponseSelected('idea 2', response1)).toBeFalse();
    expect(state.isIdeaResponseSelected('idea 1', response1)).toBeTrue();
  });

  it('checking a category adopts standalone responses matching candidates', () => {
    // Select response, then uncheck category -> becomes standalone
    state.toggleIdeaResponse('idea 1', response1);
    state.toggleIdea('idea 1');
    expect(state.standaloneResponses().size).toBe(1);

    // Recheck category with candidate responses
    state.toggleIdea('idea 1', [response1, response2]);
    expect(state.isIdeaSelected('idea 1')).toBeTrue();
    expect(state.standaloneResponses().size).toBe(0);
    expect(state.selectedIdeaResponseMap().get('idea 1')?.size).toBe(1);
    expect(state.isIdeaResponseSelected('idea 1', response1)).toBeTrue();
  });

  it('toggling a response automatically selects parent category and deselecting leaves category selected', () => {
    expect(state.isIdeaSelected('idea 1')).toBeFalse();

    state.toggleIdeaResponse('idea 1', response1);
    expect(state.isIdeaSelected('idea 1')).toBeTrue();
    expect(state.isIdeaResponseSelected('idea 1', response1)).toBeTrue();

    // Deselect response
    state.toggleIdeaResponse('idea 1', response1);
    expect(state.isIdeaResponseSelected('idea 1', response1)).toBeFalse();
    // Parent category remains selected
    expect(state.isIdeaSelected('idea 1')).toBeTrue();
  });

  it('clears all ideas selections', () => {
    state.toggleIdeaResponse('idea 1', response1);
    expect(state.hasSelections()).toBeTrue();

    expect(state.clear()).toBeTrue();
    expect(state.hasSelections()).toBeFalse();
    expect(state.selectedIdeaIds().size).toBe(0);
    expect(state.clear()).toBeFalse();
  });

  it('loads from items and serializes to payload items', () => {
    state.loadFromItems([
      {
        ideaId: 'idea 1',
        responses: [response1]
      },
      {
        ideaId: null,
        responses: [response2]
      }
    ]);

    expect(state.isIdeaSelected('idea 1')).toBeTrue();
    expect(state.isIdeaResponseSelected('idea 1', response1)).toBeTrue();
    expect(state.standaloneResponses().size).toBe(1);

    const payload = state.toPayloadItems();
    expect(payload).toEqual([
      {
        ideaId: 'idea 1',
        responses: [response1]
      },
      {
        ideaId: null,
        responses: [response2]
      }
    ]);
  });
});
