// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed } from '@angular/core/testing';
import { MockService, ngMocks } from 'ng-mocks'; // eslint-disable-line import-x/order

ngMocks.autoSpy('jasmine');

// In case, if you use @angular/router and Angular 14+.
// You might want to set a mock of DefaultTitleStrategy as TitleStrategy.
// A14 fix: making DefaultTitleStrategy to be a default mock for TitleStrategy
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router'; // eslint-disable-line import-x/order
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

// Usually, *ngIf and other declarations from CommonModule aren't expected to be mocked.
// The code below keeps them.
import { CommonModule } from '@angular/common'; // eslint-disable-line import-x/order
import { ApplicationModule, NgModule, provideZoneChangeDetection } from '@angular/core'; // eslint-disable-line import-x/order
import { BrowserModule } from '@angular/platform-browser'; // eslint-disable-line import-x/order
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);

jasmine.getEnv().allowRespy(true);

@NgModule({
  providers: [provideZoneChangeDetection()]
})
class AppTestingModule {}

// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  [BrowserTestingModule, AppTestingModule],
  platformBrowserTesting(),
  {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true
  }
);
