import { Component } from '@angular/core';
import { RegisterUserCompleteComponent } from '../register-user-complete.component';

@Component({
    selector: 'app-register-student-complete',
    templateUrl: './register-student-complete.component.html',
    styleUrls: ['./register-student-complete.component.scss'],
    standalone: false
})
export class RegisterStudentCompleteComponent extends RegisterUserCompleteComponent {}
