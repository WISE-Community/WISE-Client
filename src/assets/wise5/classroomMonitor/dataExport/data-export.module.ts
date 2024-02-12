import { NgModule } from '@angular/core';
import { DataExportComponent } from './data-export/data-export.component';
import { ExportStepVisitsComponent } from './export-step-visits/export-step-visits.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { RouterModule } from '@angular/router';
import { SelectStepAndComponentCheckboxesComponent } from './select-step-and-component-checkboxes/select-step-and-component-checkboxes.component';

@NgModule({
  imports: [RouterModule, StudentTeacherCommonModule],
  declarations: [DataExportComponent, ExportStepVisitsComponent, SelectStepAndComponentCheckboxesComponent],
  exports: [DataExportComponent, ExportStepVisitsComponent, SelectStepAndComponentCheckboxesComponent]
})
export class DataExportModule {}
