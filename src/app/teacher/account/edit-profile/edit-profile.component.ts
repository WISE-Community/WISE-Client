import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { Teacher } from '../../../domain/teacher';
import { TeacherService } from '../../teacher.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SchoolLevel, schoolLevels } from '../../../domain/profile.constants';
import { EditProfileComponent } from '../../../common/edit-profile/edit-profile.component';

@Component({
  selector: 'teacher-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: [
    '../../../common/edit-profile/edit-profile.component.scss',
    './edit-profile.component.scss'
  ]
})
export class TeacherEditProfileComponent extends EditProfileComponent {
  user: Teacher;
  schoolLevels: SchoolLevel[] = schoolLevels;
  languages: object[];
  isSaving: boolean = false;
  subscriptions: Subscription = new Subscription();

  editProfileFormGroup: FormGroup = this.fb.group({
    firstName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    lastName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    username: new FormControl({ value: '', disabled: true }, [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    schoolName: new FormControl('', [Validators.required]),
    schoolLevel: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required])
  });

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private userService: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  getUser() {
    this.subscriptions.add(
      this.userService.getUser().subscribe((user) => {
        this.user = <Teacher>user;
        this.setControlFieldValue('firstName', this.user.firstName);
        this.setControlFieldValue('lastName', this.user.lastName);
        this.setControlFieldValue('username', this.user.username);
        this.setControlFieldValue('displayName', this.user.displayName);
        this.setControlFieldValue('email', this.user.email);
        this.setControlFieldValue('city', this.user.city);
        this.setControlFieldValue('state', this.user.state);
        this.setControlFieldValue('country', this.user.country);
        this.setControlFieldValue('schoolName', this.user.schoolName);
        this.setControlFieldValue('schoolLevel', this.user.schoolLevel);
        this.setControlFieldValue('language', this.user.language);
        if (user.isGoogleUser) {
          this.editProfileFormGroup.controls['email'].disable();
        } else {
          this.editProfileFormGroup.controls['email'].enable();
        }
      })
    );
  }

  setControlFieldValue(name: string, value: string) {
    this.editProfileFormGroup.controls[name].setValue(value);
  }

  ngOnInit() {
    this.getUser();
    this.editProfileFormGroup.valueChanges.subscribe(() => {
      this.changed = true;
    });
    this.subscriptions.add(
      this.userService.getLanguages().subscribe((response) => {
        this.languages = <object[]>response;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  saveChanges() {
    this.isSaving = true;
    const displayName: string = this.getControlFieldValue('displayName');
    const email: string = this.getControlFieldValue('email');
    const city: string = this.getControlFieldValue('city');
    const state: string = this.getControlFieldValue('state');
    const country: string = this.getControlFieldValue('country');
    const schoolName: string = this.getControlFieldValue('schoolName');
    const schoolLevel: string = this.getControlFieldValue('schoolLevel');
    const language: string = this.getControlFieldValue('language');
    const username = this.user.username;
    this.teacherService
      .updateProfile(
        username,
        displayName,
        email,
        city,
        state,
        country,
        schoolName,
        schoolLevel,
        language
      )
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe((response) => {
        this.handleUpdateProfileResponse(response);
        this.userService.updateTeacherUser(
          displayName,
          email,
          city,
          state,
          country,
          schoolName,
          schoolLevel,
          language
        );
      });
  }

  getControlFieldValue(fieldName) {
    return this.editProfileFormGroup.get(fieldName).value;
  }
}
