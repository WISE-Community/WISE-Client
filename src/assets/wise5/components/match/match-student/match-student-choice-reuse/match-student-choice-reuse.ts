import { Component } from '@angular/core';
import { MatchStudentDefault } from '../match-student-default/match-student-default.component';
import { moveItem } from '../move-item';
import { MatchCdkDragDrop } from '../MatchCdkDragDrop';
import { Container } from '../container';
import { Item } from '../item';

@Component({
  styleUrls: ['../match-student-default/match-student-default.component.scss'],
  templateUrl: '../match-student-default/match-student-default.component.html'
})
export class MatchStudentChoiceReuse extends MatchStudentDefault {
  protected drop(event: MatchCdkDragDrop<Container, Item>): void {
    moveItem(event);
    event.container.element.nativeElement.classList.remove('primary-bg');
    this.studentDataChanged();
  }
}
