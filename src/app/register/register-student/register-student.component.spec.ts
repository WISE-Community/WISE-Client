import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterStudentComponent } from './register-student.component';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Config } from '../../domain/config';
import { ConfigService } from '../../services/config.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

export class MockStudentService {}

export class MockUserService {}

export class MockConfigService {
  getConfig(): Observable<Config> {
    const config: Config = {
      contextPath: '/wise',
      logOutURL: '/logout',
      currentTime: new Date('2018-10-17T00:00:00.0').getTime()
    };
    return Observable.create((observer) => {
      observer.next(config);
      observer.complete();
    });
  }
}

describe('RegisterStudentComponent', () => {
  let component: RegisterStudentComponent;
  let fixture: ComponentFixture<RegisterStudentComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegisterStudentComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: UserService, useClass: MockUserService },
          { provide: ConfigService, useClass: MockConfigService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
