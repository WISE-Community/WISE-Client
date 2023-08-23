import '../assets/wise5/lib/jquery/jquery-global';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NodeIconComponent } from '../assets/wise5/vle/node-icon/node-icon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { NodeStatusIcon } from '../assets/wise5/themes/default/themeComponents/nodeStatusIcon/node-status-icon.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { NotebookModule } from './notebook/notebook.module';
import { MatSliderModule } from '@angular/material/slider';
import { DialogResponseComponent } from '../assets/wise5/components/dialogGuidance/dialog-response/dialog-response.component';
import { DialogResponsesComponent } from '../assets/wise5/components/dialogGuidance/dialog-responses/dialog-responses.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { EditNotebookItemDialogModule } from '../assets/wise5/themes/default/notebook/edit-notebook-item-dialog/edit-notebook-item-dialog.module';
import { StudentTeacherCommonServicesModule } from './student-teacher-common-services.module';
import { MathModule } from './math/math.module';
import { MatMenuModule } from '@angular/material/menu';
import { MainMenuComponent } from '../assets/wise5/common/main-menu/main-menu.component';
import { SideMenuComponent } from '../assets/wise5/common/side-menu/side-menu.component';

@NgModule({
  declarations: [
    DialogResponseComponent,
    DialogResponsesComponent,
    MainMenuComponent,
    NodeIconComponent,
    NodeStatusIcon,
    SideMenuComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    EditNotebookItemDialogModule,
    EditorModule,
    FlexLayoutModule,
    FormsModule,
    HighchartsChartModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatTabsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MathModule,
    NotebookModule,
    ReactiveFormsModule,
    StudentTeacherCommonServicesModule
  ],
  exports: [
    CommonModule,
    DialogResponseComponent,
    DialogResponsesComponent,
    DragDropModule,
    EditorModule,
    FlexLayoutModule,
    FormsModule,
    MainMenuComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MathModule,
    NodeIconComponent,
    NodeStatusIcon,
    NotebookModule,
    ReactiveFormsModule,
    SideMenuComponent
  ]
})
export class StudentTeacherCommonModule {}
