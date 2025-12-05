import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { finalize } from 'rxjs/operators';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { LibraryService } from '../../services/library.service';
import { ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha-2';
import { Student } from '../../domain/student';
import { StudentService } from '../../student/student.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { Teacher } from '../../domain/teacher';
import { UserService } from '../../services/user.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    MatCard,
    MatCardContent,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatOption,
    MatProgressBar,
    RecaptchaV3Module
  ],
  selector: 'app-contact-form',
  styles: `
    .contact__form {
      width: 800px;
    }
  `,
  templateUrl: './contact-form.component.html'
})
export class ContactFormComponent implements OnInit {
  protected complete: boolean = false;
  protected contactFormGroup: FormGroup = this.fb.group({
    name: new FormControl('', [Validators.required]),
    issueType: new FormControl('', [Validators.required]),
    summary: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  protected isError: boolean = false;
  protected isSendingRequest: boolean = false;
  private isSignedIn: boolean = false;
  protected isStudent: boolean = false;
  protected issueTypes: object[] = [];
  private isPublish: boolean = false;
  protected isRecaptchaEnabled: boolean = false;
  protected isRecaptchaError: boolean = false;
  private projectId: number;
  protected projectName: string;
  private runId: number;
  protected teachers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private configService: ConfigService,
    private studentService: StudentService,
    private libraryService: LibraryService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isSignedIn = this.userService.isSignedIn();
    this.isStudent = this.userService.isStudent();
    this.obtainRunIdOrProjectIdIfNecessary();
    this.obtainTeacherListIfNecessary();
    this.showEmailIfNecessary();
    this.isRecaptchaEnabled = this.configService.isRecaptchaEnabled();
    this.populateFieldsIfSignedIn();
    this.populateIssueTypes();
    this.setDefaultPublishSummary();
    this.setIsPublish();
    this.setIssueTypeIfNecessary();
  }

  private obtainRunIdOrProjectIdIfNecessary(): void {
    this.route.queryParams.subscribe((params) => {
      this.runId = params['runId'];
      this.projectId = params['projectId'];
      if (this.runId) {
        this.studentService.getRunInfoById(this.runId).subscribe((runInfo) => {
          this.projectName = runInfo.name;
        });
      }
      if (this.projectId) {
        this.libraryService.getProjectInfo(this.projectId).subscribe((project) => {
          this.projectName = project.name;
        });
      }
    });
  }

  private obtainTeacherListIfNecessary(): void {
    if (this.isStudent && this.runId == null && this.projectId == null) {
      this.studentService.getTeacherList().subscribe((teacherList) => {
        this.teachers = teacherList;
        if (this.studentHasTeacher()) {
          this.contactFormGroup.addControl('teacher', new FormControl('', [Validators.required]));
          this.setControlFieldValue('teacher', this.teachers[0].username);
        }
      });
    }
  }

  private studentHasTeacher(): boolean {
    return this.teachers.length > 0;
  }

  showEmailIfNecessary() {
    if (this.isStudent) {
      this.contactFormGroup.removeControl('email');
    } else {
      this.contactFormGroup.addControl(
        'email',
        new FormControl('', [Validators.required, Validators.email])
      );
    }
  }

  private populateFieldsIfSignedIn(): void {
    if (this.isSignedIn) {
      if (this.isStudent) {
        const user = <Student>this.userService.getUser().getValue();
        this.setControlFieldValue('name', user.firstName + ' ' + user.lastName);
        this.markControlFieldAsDisabled('name');
      } else {
        const user = <Teacher>this.userService.getUser().getValue();
        this.setControlFieldValue('name', user.firstName + ' ' + user.lastName);
        this.setControlFieldValue('email', user.email);
        this.markControlFieldAsDisabled('name');
        this.markControlFieldAsDisabled('email');
      }
    }
  }

  private populateIssueTypes(): void {
    if (this.isStudent) {
      this.issueTypes = [
        { key: 'TROUBLE_LOGGING_IN', value: $localize`Trouble Signing In` },
        { key: 'NEED_HELP_USING_WISE', value: $localize`Need Help Using WISE` },
        { key: 'PROJECT_PROBLEMS', value: $localize`Problems with a WISE Unit` },
        { key: 'FEEDBACK', value: $localize`Feedback to WISE` },
        { key: 'OTHER', value: $localize`Other` }
      ];
    } else {
      this.issueTypes = [
        { key: 'TROUBLE_LOGGING_IN', value: $localize`Trouble Signing In` },
        { key: 'NEED_HELP_USING_WISE', value: $localize`Need Help Using WISE` },
        { key: 'PROJECT_PROBLEMS', value: $localize`Problems with a WISE Unit` },
        { key: 'STUDENT_MANAGEMENT', value: $localize`Student Management` },
        { key: 'AUTHORING', value: $localize`Need Help with Authoring` },
        { key: 'PUBLISH', value: $localize`Publish Unit` },
        { key: 'FEEDBACK', value: $localize`Feedback to WISE` },
        { key: 'OTHER', value: $localize`Other` }
      ];
    }
  }

  private setDefaultPublishSummary(): void {
    this.contactFormGroup.get('issueType').valueChanges.subscribe(() => {
      if (this.getControlFieldValue('issueType') === 'PUBLISH') {
        const summaryControl = this.contactFormGroup.get('summary');
        summaryControl.setValue($localize`Publish my unit to the WISE Community Built library`);
      }
    });
  }

  private setIssueTypeIfNecessary(): void {
    if (this.runId != null) {
      this.setControlFieldValue('issueType', 'PROJECT_PROBLEMS');
    } else if (this.isPublish) {
      this.setControlFieldValue('issueType', 'PUBLISH');
    }
  }

  private setIsPublish(): void {
    this.route.queryParams.subscribe((params) => {
      this.isPublish = params['publish'];
    });
  }

  async submit(): Promise<Subscription> {
    this.isError = false;
    const recaptchaResponse = await this.getRecaptchaResponse();
    this.setIsSendingRequest(true);
    return this.userService
      .sendContactMessage(
        this.getControlFieldValue('name'),
        this.getControlFieldValueOrNull('email', !this.isStudent),
        this.getControlFieldValueOrNull('teacher', this.isStudent && this.studentHasTeacher()),
        this.getControlFieldValue('issueType'),
        this.getControlFieldValue('summary'),
        this.getControlFieldValue('description'),
        this.runId,
        this.projectId,
        this.getUserAgent(),
        recaptchaResponse
      )
      .pipe(
        finalize(() => {
          this.setIsSendingRequest(false);
        })
      )
      .subscribe((response) => {
        this.handleSendContactMessageResponse(response);
      });
  }

  private handleSendContactMessageResponse(response: any): void {
    if (response.status === 'success') {
      this.complete = true;
    } else if (response.status === 'error') {
      this.isError = true;
      if (this.isRecaptchaEnabled) {
        this.isRecaptchaError = true;
      }
    }
    this.setIsSendingRequest(false);
  }

  setControlFieldValue(name: string, value: string): void {
    this.contactFormGroup.controls[name].setValue(value);
  }

  private markControlFieldAsDisabled(name: string): void {
    this.contactFormGroup.controls[name].disable();
  }

  private getControlFieldValue(fieldName: string): any {
    return this.contactFormGroup.get(fieldName).value;
  }

  private getControlFieldValueOrNull(fieldName: string, condition: boolean): any {
    return condition ? this.getControlFieldValue(fieldName) : null;
  }

  private getUserAgent(): string {
    return navigator.userAgent;
  }

  private async getRecaptchaResponse(): Promise<string> {
    return this.configService.isRecaptchaEnabled()
      ? await lastValueFrom(this.recaptchaV3Service.execute('importantAction'))
      : '';
  }

  private setIsSendingRequest(value: boolean): void {
    this.isSendingRequest = value;
  }

  protected isPublishIssueType(): boolean {
    return this.getControlFieldValue('issueType') === 'PUBLISH';
  }
}
