import { NgModule } from '@angular/core';
import { ChooseImportComponentComponent } from './choose-import-component/choose-import-component.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';

@NgModule({
  declarations: [ChooseImportComponentComponent],
  exports: [ChooseImportComponentComponent],
  imports: [StudentTeacherCommonModule]
})
export class ImportComponentModule {}
