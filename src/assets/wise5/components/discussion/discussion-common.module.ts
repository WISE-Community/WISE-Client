import { NgModule } from '@angular/core';
import { AngularJSModule } from '../../../../app/common-hybrid-angular.module';
import { StudentComponentModule } from '../../../../app/student/student.component.module';
import { ComponentStateInfoModule } from '../../common/component-state-info/component-state-info.module';
import { ClassResponse } from './class-response/class-response.component';

@NgModule({
  declarations: [ClassResponse],
  imports: [AngularJSModule, ComponentStateInfoModule, StudentComponentModule],
  exports: [ClassResponse]
})
export class DiscussionCommonModule {}
