import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddYourOwnNode } from '../../assets/wise5/authoringTool/addNode/add-your-own-node/add-your-own-node.component';
import { ChooseNewNodeLocation } from '../../assets/wise5/authoringTool/addNode/choose-new-node-location/choose-new-node-location.component';
import { ChooseNewNodeTemplate } from '../../assets/wise5/authoringTool/addNode/choose-new-node-template/choose-new-node-template.component';
import { AdvancedProjectAuthoringComponent } from '../../assets/wise5/authoringTool/advanced/advanced-project-authoring.component';
import { CardSelectorComponent } from '../../assets/wise5/authoringTool/components/card-selector/card-selector.component';
import { NodeAdvancedBranchAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/branch/node-advanced-branch-authoring.component';
import { NodeAdvancedConstraintAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/general/node-advanced-general-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/json/node-advanced-json-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from '../../assets/wise5/authoringTool/node/advanced/path/node-advanced-path-authoring.component';
import { RequiredErrorLabelComponent } from '../../assets/wise5/authoringTool/node/advanced/required-error-label/required-error-label.component';
import { RubricAuthoringComponent } from '../../assets/wise5/authoringTool/rubric/rubric-authoring.component';
import { NodeIconChooserDialog } from '../../assets/wise5/common/node-icon-chooser-dialog/node-icon-chooser-dialog.component';
import { ChooseNewComponentLocation } from '../authoring-tool/add-component/choose-new-component-location/choose-new-component-location.component';
import { ChooseNewComponent } from '../authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { ChooseImportStepLocationComponent } from '../authoring-tool/import-step/choose-import-step-location/choose-import-step-location.component';
import { ChooseImportStepComponent } from '../authoring-tool/import-step/choose-import-step/choose-import-step.component';
import { AngularJSModule } from '../common-hybrid-angular.module';
import { ComponentAuthoringModule } from './component-authoring.module';
import { ComponentStudentModule } from '../../assets/wise5/components/component/component-student.module';
import { PreviewComponentModule } from '../../assets/wise5/authoringTool/components/preview-component/preview-component.module';

@NgModule({
  declarations: [
    AddYourOwnNode,
    AdvancedProjectAuthoringComponent,
    CardSelectorComponent,
    ChooseImportStepComponent,
    ChooseImportStepLocationComponent,
    ChooseNewComponent,
    ChooseNewComponentLocation,
    ChooseNewNodeLocation,
    ChooseNewNodeTemplate,
    NodeAdvancedBranchAuthoringComponent,
    NodeAdvancedConstraintAuthoringComponent,
    NodeAdvancedGeneralAuthoringComponent,
    NodeAdvancedJsonAuthoringComponent,
    NodeAdvancedPathAuthoringComponent,
    NodeIconChooserDialog,
    RequiredErrorLabelComponent,
    RubricAuthoringComponent
  ],
  imports: [
    AngularJSModule,
    ComponentAuthoringModule,
    ComponentStudentModule,
    PreviewComponentModule,
    RouterModule
  ]
})
export class AuthoringToolModule {}
