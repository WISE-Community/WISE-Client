import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GraphStudentModule } from '../../graph/graph-student/graph-student.module';
import { MatchStudentModule } from '../../match/match-student/match-student.module';
import { OpenResponseStudentModule } from '../../openResponse/open-response-student/open-response-student.module';
import { ShowGroupWorkStudentComponent } from './show-group-work-student.component';

@NgModule({
  declarations: [ShowGroupWorkStudentComponent],
  imports: [CommonModule, GraphStudentModule, MatchStudentModule, OpenResponseStudentModule],
  exports: [ShowGroupWorkStudentComponent]
})
export class ShowGroupWorkStudentModule {}
