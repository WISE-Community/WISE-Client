import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Student } from '../../../domain/student';
import { UserService } from '../../../services/user.service';
import { StudentService } from '../../student.service';
import { Subscription } from 'rxjs';
import { EditProfileComponent } from '../../../common/edit-profile/edit-profile.component';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatOption,
    MatButton,
    MatProgressBar
  ],
  selector: 'student-edit-profile',
  styleUrls: [
    '../../../common/edit-profile/edit-profile.component.scss',
    './edit-profile.component.scss'
  ],
  templateUrl: './edit-profile.component.html'
})
export class StudentEditProfileComponent extends EditProfileComponent {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private userService = inject(UserService);

  user: Student;
  languages: object[];
  isSaving: boolean = false;
  isGoogleUser: boolean = false;
  userSubscription: Subscription;
  editProfileFormGroup: FormGroup = this.fb.group({
    firstName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    lastName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    username: new FormControl({ value: '', disabled: true }, [Validators.required]),
    language: new FormControl('', [Validators.required])
  });

  getUser() {
    return this.userService.getUser();
  }

  setControlFieldValue(name: string, value: string) {
    this.editProfileFormGroup.controls[name].setValue(value);
  }

  ngOnInit() {
     this.user = <Student>this.getUser().getValue();
    this.setControlFieldValue('firstName', this.user.firstName);
    this.setControlFieldValue('lastName', this.user.lastName);
    this.setControlFieldValue('username', this.user.username);
    this.setControlFieldValue('language', this.user.language);
    this.userService.getLanguages().subscribe((response) => {
      this.languages = <object[]>response;
    });
    this.editProfileFormGroup.valueChanges.subscribe(() => {
      this.changed = true;
    });
    this.userSubscription = this.userService.getUser().subscribe((user) => {
      this.isGoogleUser = user.isGoogleUser;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  saveChanges() {
    this.isSaving = true;
    const username = this.user.username;
    const language = this.getControlFieldValue('language');
    this.studentService
      .updateProfile(username, language)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe((response) => {
        this.handleUpdateProfileResponse(response);
        this.userService.updateStudentUser(language);
      });
  }

  getControlFieldValue(fieldName) {
    return this.editProfileFormGroup.get(fieldName).value;
  }
}
