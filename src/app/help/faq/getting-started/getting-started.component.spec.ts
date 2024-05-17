import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GettingStartedComponent } from './getting-started.component';
import { ConfigService } from '../../../services/config.service';
import { Config } from '../../../domain/config';
import { Observable } from 'rxjs';
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

describe('GettingStartedComponent', () => {
  let component: GettingStartedComponent;
  let fixture: ComponentFixture<GettingStartedComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [GettingStartedComponent],
        providers: [{ provide: ConfigService, useClass: MockConfigService }, provideRouter([])]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
