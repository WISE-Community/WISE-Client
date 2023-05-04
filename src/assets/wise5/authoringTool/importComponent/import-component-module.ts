import { NgModule } from '@angular/core';
import { ChooseImportComponentComponent } from './choose-import-component/choose-import-component.component';
import { ChooseImportComponentLocationComponent } from './choose-import-component-location/choose-import-component-location.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';

@NgModule({
  declarations: [ChooseImportComponentComponent, ChooseImportComponentLocationComponent],
  imports: [StudentTeacherCommonModule]
})
export class ImportComponentModule {}
