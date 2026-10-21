import { computed, signal } from '@angular/core';
import { DiscussionPresentationItem } from '../models/teacher-presentation-config';

export class DiscussionSelectionState {
  readonly selectedIds = signal<Set<number>>(new Set<number>());

  readonly selectedCount = computed(() => this.selectedIds().size);
  readonly hasSelections = computed(() => this.selectedCount() > 0);

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  select(id: number): boolean {
    const current = new Set(this.selectedIds());
    if (!current.has(id)) {
      current.add(id);
      this.selectedIds.set(current);
      return true;
    }
    return false;
  }

  deselect(id: number): boolean {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
      this.selectedIds.set(current);
      return true;
    }
    return false;
  }

  toggle(id: number): boolean {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
    return true;
  }

  selectMultiple(ids: number[]): boolean {
    const current = new Set(this.selectedIds());
    let changed = false;
    for (const id of ids) {
      if (!current.has(id)) {
        current.add(id);
        changed = true;
      }
    }
    if (changed) {
      this.selectedIds.set(current);
    }
    return changed;
  }

  deselectMultiple(ids: number[]): boolean {
    const current = new Set(this.selectedIds());
    let changed = false;
    for (const id of ids) {
      if (current.has(id)) {
        current.delete(id);
        changed = true;
      }
    }
    if (changed) {
      this.selectedIds.set(current);
    }
    return changed;
  }

  setSelections(ids: Set<number> | number[]): boolean {
    this.selectedIds.set(new Set(ids));
    return true;
  }

  clear(): boolean {
    if (this.selectedIds().size === 0) {
      return false;
    }
    this.reset();
    return true;
  }

  reset(): void {
    this.selectedIds.set(new Set<number>());
  }

  loadFromItems(items: any[]): void {
    const ids = new Set<number>();
    if (items) {
      items.forEach((item: any) => {
        if (item?.studentWorkId != null) {
          ids.add(item.studentWorkId);
        }
      });
    }
    this.selectedIds.set(ids);
  }

  toPayloadItems(): DiscussionPresentationItem[] {
    return Array.from(this.selectedIds()).map((id) => ({
      studentWorkId: id
    }));
  }
}
