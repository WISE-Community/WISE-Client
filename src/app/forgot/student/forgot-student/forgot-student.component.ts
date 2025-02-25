import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CallToActionComponent } from '../../../modules/shared/call-to-action/call-to-action.component';

@Component({
    imports: [CallToActionComponent, FlexLayoutModule],
    styleUrl: './forgot-student.component.scss',
    templateUrl: './forgot-student.component.html'
})
export class ForgotStudentComponent {}
