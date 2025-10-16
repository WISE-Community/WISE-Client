import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../../app/student-teacher-common.module';
import { StudentComponentModule } from '../../../../../app/student/student.component.module';
import { SummaryStudent } from './summary-student.component';
import { StudentSummaryDisplay } from '../../../directives/student-summary-display/student-summary-display.component';

@NgModule({
    imports: [StudentTeacherCommonModule, StudentComponentModule, StudentSummaryDisplay, SummaryStudent],
    exports: [SummaryStudent]
})
export class SummaryStudentModule {}
