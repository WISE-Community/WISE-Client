import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ComponentStateInfoComponent } from '../../assets/wise5/common/component-state-info/component-state-info.component';
import { NotebookItemComponent } from './notebook-item/notebook-item.component';
import { NotebookLauncherComponent } from './notebook-launcher/notebook-launcher.component';
import { NotebookNotesComponent } from './notebook-notes/notebook-notes.component';
import { NotebookParentComponent } from './notebook-parent/notebook-parent.component';
import { NotebookReportAnnotationsComponent } from './notebook-report-annotations/notebook-report-annotations.component';
import { NotebookReportComponent } from './notebook-report/notebook-report.component';
import { WiseTinymceEditorComponent } from '../../assets/wise5/directives/wise-tinymce-editor/wise-tinymce-editor.component';

@NgModule({
  declarations: [
    NotebookParentComponent,
    NotebookItemComponent,
    NotebookLauncherComponent,
    NotebookNotesComponent,
    NotebookReportComponent,
    NotebookReportAnnotationsComponent
  ],
  imports: [
    CommonModule,
    ComponentStateInfoComponent,
    EditorModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    WiseTinymceEditorComponent
  ],
  exports: [
    NotebookParentComponent,
    NotebookItemComponent,
    NotebookLauncherComponent,
    NotebookNotesComponent,
    NotebookReportComponent,
    NotebookReportAnnotationsComponent
  ]
})
export class NotebookModule {}
