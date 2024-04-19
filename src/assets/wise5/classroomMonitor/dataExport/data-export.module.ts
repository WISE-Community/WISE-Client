import { NgModule } from '@angular/core';
import { DataExportComponent } from './data-export/data-export.component';
import { ExportStepVisitsComponent } from './export-step-visits/export-step-visits.component';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { RouterModule } from '@angular/router';
import { SelectStepAndComponentCheckboxesComponent } from './select-step-and-component-checkboxes/select-step-and-component-checkboxes.component';
import { ExportItemComponent } from './export-item/export-item.component';
import { ExportRawDataComponent } from './export-raw-data/export-raw-data.component';
import { ExportEventsComponent } from './export-events/export-events.component';
import { ExportOneWorkgroupPerRowComponent } from './export-one-workgroup-per-row/export-one-workgroup-per-row.component';

@NgModule({
  imports: [RouterModule, StudentTeacherCommonModule],
  declarations: [
    DataExportComponent,
    ExportEventsComponent,
    ExportItemComponent,
    ExportOneWorkgroupPerRowComponent,
    ExportRawDataComponent,
    ExportStepVisitsComponent,
    SelectStepAndComponentCheckboxesComponent
  ],
  exports: [
    DataExportComponent,
    ExportEventsComponent,
    ExportItemComponent,
    ExportOneWorkgroupPerRowComponent,
    ExportRawDataComponent,
    ExportStepVisitsComponent,
    SelectStepAndComponentCheckboxesComponent
  ]
})
export class DataExportModule {}
