import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from '../../../domain/student';
import { UserService } from '../../../services/user.service';
import { StudentService } from '../../student.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../../../common/edit-profile/edit-profile.component';

@Component({
  selector: 'student-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: [
    '../../../common/edit-profile/edit-profile.component.scss',
    './edit-profile.component.scss'
  ]
})
export class StudentEditProfileComponent extends EditProfileComponent {
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

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private userService: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
    this.user = <Student>this.getUser().getValue();
    this.setControlFieldValue('firstName', this.user.firstName);
    this.setControlFieldValue('lastName', this.user.lastName);
    this.setControlFieldValue('username', this.user.username);
    this.setControlFieldValue('language', this.user.language);
    this.userService.getLanguages().subscribe((response) => {
      this.languages = <object[]>response;
    });
  }

  getUser() {
    return this.userService.getUser();
  }

  setControlFieldValue(name: string, value: string) {
    this.editProfileFormGroup.controls[name].setValue(value);
  }

  ngOnInit() {
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
