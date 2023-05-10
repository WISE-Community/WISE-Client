import { copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Item } from './item';
import { Container } from './container';
import { MatchCdkDragDrop } from './MatchCdkDragDrop';
import { copy } from '../../../common/object/object';

export function moveItem(event: MatchCdkDragDrop<Container, Item>): void {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data.items, event.item.data.position, event.currentIndex);
  } else {
    dropToDifferentContainer(event);
  }
}

function dropToDifferentContainer(event: MatchCdkDragDrop<Container, Item>): void {
  if (toContainerContainsItem(event)) {
    if (!fromContainerIsSourceBucket(event) || toContainerIsSourceBucket(event)) {
      fromContainerRemoveItem(event);
    }
  } else {
    if (fromContainerIsSourceBucket(event)) {
      copyArrayItem(
        copy(event.previousContainer.data.items),
        event.container.data.items,
        event.item.data.position,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data.items,
        event.container.data.items,
        event.item.data.position,
        event.currentIndex
      );
    }
  }
}

function toContainerContainsItem(event: MatchCdkDragDrop<Container, Item>): boolean {
  return event.container.data.items.some((item) => item.id === event.item.data.item.id);
}

function fromContainerIsSourceBucket(event: MatchCdkDragDrop<Container, Item>): boolean {
  return event.previousContainer.data.isSourceBucket;
}

function toContainerIsSourceBucket(event: MatchCdkDragDrop<Container, Item>): boolean {
  return event.container.data.isSourceBucket;
}

function fromContainerRemoveItem(event: MatchCdkDragDrop<Container, Item>): void {
  event.previousContainer.data.items.splice(event.previousIndex, 1);
}
