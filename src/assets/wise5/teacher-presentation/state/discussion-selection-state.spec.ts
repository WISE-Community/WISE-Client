import { DiscussionSelectionState } from './discussion-selection-state';

describe('DiscussionSelectionState', () => {
  let state: DiscussionSelectionState;

  beforeEach(() => {
    state = new DiscussionSelectionState();
  });

  it('initializes with empty selection', () => {
    expect(state.selectedCount()).toBe(0);
    expect(state.hasSelections()).toBeFalse();
    expect(state.selectedIds().size).toBe(0);
  });

  it('selects and deselects single items', () => {
    expect(state.select(101)).toBeTrue();
    expect(state.isSelected(101)).toBeTrue();
    expect(state.selectedCount()).toBe(1);
    expect(state.hasSelections()).toBeTrue();

    // Selecting again should return false (no change)
    expect(state.select(101)).toBeFalse();

    expect(state.deselect(101)).toBeTrue();
    expect(state.isSelected(101)).toBeFalse();
    expect(state.selectedCount()).toBe(0);
    expect(state.hasSelections()).toBeFalse();

    // Deselecting non-selected should return false
    expect(state.deselect(101)).toBeFalse();
  });

  it('toggles item selection', () => {
    expect(state.toggle(101)).toBeTrue();
    expect(state.isSelected(101)).toBeTrue();

    expect(state.toggle(101)).toBeTrue();
    expect(state.isSelected(101)).toBeFalse();
  });

  it('handles multiple selection operations', () => {
    expect(state.selectMultiple([1, 2, 3])).toBeTrue();
    expect(state.selectedCount()).toBe(3);

    // Partial overlap
    expect(state.selectMultiple([2, 3, 4])).toBeTrue();
    expect(state.selectedCount()).toBe(4);

    // Exact overlap
    expect(state.selectMultiple([1, 2, 3, 4])).toBeFalse();

    expect(state.deselectMultiple([1, 2])).toBeTrue();
    expect(state.selectedCount()).toBe(2);
    expect(state.isSelected(1)).toBeFalse();
    expect(state.isSelected(3)).toBeTrue();

    // Deselect non-present items
    expect(state.deselectMultiple([99, 100])).toBeFalse();
  });

  it('sets selections from Set or Array', () => {
    state.setSelections([10, 20]);
    expect(state.selectedCount()).toBe(2);
    expect(state.isSelected(10)).toBeTrue();

    state.setSelections(new Set([30]));
    expect(state.selectedCount()).toBe(1);
    expect(state.isSelected(30)).toBeTrue();
    expect(state.isSelected(10)).toBeFalse();
  });

  it('clears selections', () => {
    state.select(1);
    expect(state.clear()).toBeTrue();
    expect(state.selectedCount()).toBe(0);
    expect(state.clear()).toBeFalse();
  });

  it('loads from items and serializes to payload items', () => {
    state.loadFromItems([
      { studentWorkId: 101 },
      { studentWorkId: 102 },
      { studentWorkId: null },
      null
    ]);

    expect(state.selectedCount()).toBe(2);
    expect(state.isSelected(101)).toBeTrue();
    expect(state.isSelected(102)).toBeTrue();

    const payload = state.toPayloadItems();
    expect(payload).toEqual([
      { studentWorkId: 101 },
      { studentWorkId: 102 }
    ]);
  });
});
