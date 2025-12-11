import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { UtilService } from './services/util.service';
import { Announcement } from './domain/announcement';
import { ConfigService } from './services/config.service';
import { Config } from './domain/config';
import { environment } from '../environments/environment';
import { provideRouter } from '@angular/router';
import { MockComponents, MockProviders } from 'ng-mocks';
import { UserService } from './services/user.service';
import { MobileMenuComponent } from './modules/mobile-menu/mobile-menu.component';
import { provideHttpClient } from '@angular/common/http';
import { HeaderComponent } from './modules/header/header.component';

export class MockConfigService {
  private config$: BehaviorSubject<Config> = new BehaviorSubject<Config>(null);

  getAnnouncement(): Observable<Announcement> {
    return new Observable((observer) => {
      const announcement: Announcement = new Announcement();
      announcement.visible = true;
      observer.next(announcement);
      observer.complete();
    });
  }

  getConfig(): Observable<Config> {
    const config: Config = new Config();
    config.googleAnalyticsId = 'UA-XXXXXX-1';
    config.googleTagManagerId = 'GTM-XXXXXXXX';
    this.config$.next(config);
    return this.config$;
  }

  getGoogleAnalyticsId(): string {
    return this.config$.getValue().googleAnalyticsId;
  }

  getGoogleTagManagerId(): string {
    return this.config$.getValue().googleTagManagerId;
  }
}

export class MockUtilService {
  getMobileMenuState(): Observable<boolean> {
    return new Observable((observer) => {
      observer.next(false);
      observer.complete();
    });
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  environment.production = true;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent, MockComponents(HeaderComponent, MobileMenuComponent)],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        { provide: UtilService, useClass: MockUtilService },
        MockProviders(UserService),
        provideHttpClient(),
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'app'`, () => {
    expect(component.title).toEqual('app');
  });

  it(`should show announcement banner and hide when dismissed`, () => {
    component.hasAnnouncement = true;
    fixture.detectChanges();
    const shadowRoot: DocumentFragment = fixture.debugElement.nativeElement;
    expect(shadowRoot.querySelector('app-announcement')).toBeTruthy();
    component.dismissAnnouncement();
    fixture.detectChanges();
    expect(shadowRoot.querySelector('app-announcement')).toBeFalsy();
  });

  it(`should set Google Analytics tracking code`, () => {
    expect(component.googleAnalyticsId).toEqual('UA-XXXXXX-1');
  });

  it(`should set Google Tag manager tracking script`, () => {
    const scriptElement = document.querySelector(
      'head > script[src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXXX"]'
    );
    expect(scriptElement).toBeTruthy();
  });
});
