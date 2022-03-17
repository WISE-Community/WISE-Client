import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NodeComponent } from './node.component';
import { HelpIconModule } from '../../themes/default/themeComponents/helpIcon/help-icon.module';
import { ComponentStudentModule } from '../../components/component/component-student.module';
import { MomentModule } from 'ngx-moment';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [NodeComponent],
  imports: [
    CommonModule,
    ComponentStudentModule,
    FlexLayoutModule,
    HelpIconModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MomentModule
  ],
  exports: [NodeComponent]
})
export class NodeModule {}
