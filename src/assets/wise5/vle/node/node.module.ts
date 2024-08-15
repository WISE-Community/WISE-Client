import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NodeComponent } from './node.component';
import { HelpIconComponent } from '../../themes/default/themeComponents/helpIcon/help-icon.component';
import { ComponentStudentModule } from '../../components/component/component-student.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComponentStateInfoComponent } from '../../common/component-state-info/component-state-info.component';

@NgModule({
  declarations: [NodeComponent],
  imports: [
    CommonModule,
    ComponentStateInfoComponent,
    ComponentStudentModule,
    FlexLayoutModule,
    HelpIconComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [NodeComponent]
})
export class NodeModule {}
