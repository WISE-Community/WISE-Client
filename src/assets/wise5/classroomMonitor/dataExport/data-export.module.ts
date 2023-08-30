import { NgModule } from '@angular/core';
import { DataExportComponent } from './data-export/data-export.component';
import { ExportStepVisitsComponent } from './export-step-visits/export-step-visits.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule, StudentTeacherCommonModule],
  declarations: [DataExportComponent, ExportStepVisitsComponent],
  exports: [DataExportComponent, ExportStepVisitsComponent]
})
export class DataExportModule {}
