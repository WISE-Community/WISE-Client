import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StudentFaqComponent } from './student-faq.component';
import { ConfigService } from '../../../services/config.service';
import { Observable } from 'rxjs';
import { Config } from '../../../domain/config';
import { provideRouter } from '@angular/router';

export class MockConfigService {
  getConfig(): Observable<Config> {
    const config: Config = {
      contextPath: '/wise',
      logOutURL: '/logout',
      currentTime: new Date('2018-10-24T15:05:40.214').getTime()
    };
    return new Observable((observer) => {
      observer.next(config);
      observer.complete();
    });
  }
}

describe('StudentFaqComponent', () => {
  let component: StudentFaqComponent;
  let fixture: ComponentFixture<StudentFaqComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [StudentFaqComponent],
        providers: [{ provide: ConfigService, useClass: MockConfigService }, provideRouter([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
