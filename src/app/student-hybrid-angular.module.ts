import { NgModule } from '@angular/core';

import { createStudentAngularJSModule } from '../assets/wise5/vle/student-angular-js-module';
import { bootstrapAngularJSModule } from './common-hybrid-angular.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { ProjectService } from '../assets/wise5/services/projectService';
import { VLEProjectService } from '../assets/wise5/vle/vleProjectService';
import { CommonModule } from '@angular/common';
import { StudentDataService } from '../assets/wise5/services/studentDataService';
import { MatDialogModule } from '@angular/material/dialog';
import { ChooseBranchPathDialogComponent } from './preview/modules/choose-branch-path-dialog/choose-branch-path-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { DataService } from './services/data.service';
import { AngularJSModule } from './common-hybrid-angular.module';
import { NavItemComponent } from '../assets/wise5/vle/nav-item/nav-item.component';
import { StudentComponentModule } from './student/student.component.module';
import { SafeUrl } from '../assets/wise5/directives/safeUrl/safe-url.pipe';
import { StepToolsComponent } from '../assets/wise5/themes/default/themeComponents/stepTools/step-tools.component';
import { NavigationComponent } from '../assets/wise5/themes/default/navigation/navigation.component';
import { SummaryDisplayModule } from '../assets/wise5/directives/summaryDisplay/summary-display.module';
import { GenerateImageDialogComponent } from '../assets/wise5/directives/generate-image-dialog/generate-image-dialog.component';
import { TopBarModule } from './student/top-bar/top-bar.module';
import { StudentAssetsDialogModule } from '../assets/wise5/vle/studentAsset/student-assets-dialog/student-assets-dialog.module';
import { ComponentStudentModule } from '../assets/wise5/components/component/component-student.module';
import { NodeModule } from '../assets/wise5/vle/node/node.module';
import { VLEComponent } from '../assets/wise5/vle/vle.component';
import { NotebookModule } from './notebook/notebook.module';
import { SimpleDialogModule } from '../assets/wise5/directives/simple-dialog.module';

@NgModule({
  declarations: [
    GenerateImageDialogComponent,
    NavigationComponent,
    NavItemComponent,
    SafeUrl,
    StepToolsComponent,
    VLEComponent
  ],
  imports: [
    AngularJSModule,
    ComponentStudentModule,
    NodeModule,
    NotebookModule,
    SimpleDialogModule,
    StudentAssetsDialogModule,
    StudentComponentModule,
    SummaryDisplayModule,
    TopBarModule
  ],
  providers: [
    { provide: DataService, useExisting: StudentDataService },
    { provide: ProjectService, useExisting: VLEProjectService },
    VLEProjectService
  ],
  exports: [CommonModule, MatButtonModule, MatDialogModule, MatListModule]
})
export class StudentAngularJSModule {}

@NgModule({
  declarations: [ChooseBranchPathDialogComponent],
  imports: [StudentAngularJSModule]
})
export class StudentVLEAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    createStudentAngularJSModule('vle');
    bootstrapAngularJSModule(upgrade, 'vle');
  }
}

@NgModule({
  imports: [StudentAngularJSModule]
})
export class PreviewAngularJSModule {
  constructor(upgrade: UpgradeModule) {
    createStudentAngularJSModule('preview');
    bootstrapAngularJSModule(upgrade, 'preview');
  }
}
