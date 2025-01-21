import { NgModule } from '@angular/core';
import { ChooseImportComponentComponent } from './choose-import-component/choose-import-component.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';

@NgModule({
  exports: [ChooseImportComponentComponent],
  imports: [ChooseImportComponentComponent, StudentTeacherCommonModule]
})
export class ImportComponentModule {}
