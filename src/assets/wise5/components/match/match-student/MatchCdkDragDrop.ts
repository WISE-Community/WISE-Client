import { CdkDragDrop } from '@angular/cdk/drag-drop';

export interface MatchCdkDragDrop<Container, Item>
  extends CdkDragDrop<Container, Container, Item> {}
