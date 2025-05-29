// import { ConfigService } from './config.service';
// import { fakeAsync, TestBed, tick } from '@angular/core/testing';
// import { HttpClient } from '@angular/common/http';
// import { LogOutService } from './logOutService';
// import { MockProviders } from 'ng-mocks';
// import { of } from 'rxjs';
// import { Router } from '@angular/router';

// let service: LogOutService;
// let httpSpy: jasmine.Spy;
// let routerSpy: jasmine.Spy;
// export class MockConfigService {}

// describe('LogOutService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [],
//       providers: [LogOutService, MockProviders(ConfigService, HttpClient, Router)]
//     });
//     service = TestBed.inject(LogOutService);
//     httpSpy = spyOn(TestBed.inject(HttpClient), 'get').and.returnValue(of({}));
//     routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl').and.returnValue(
//       new Promise<boolean>(() => true)
//     );
//     spyOn(TestBed.inject(ConfigService), 'getConfig').and.returnValue(
//       of({ contextPath: '', logOutURL: 'api/logOutUrl', currentTime: 0 })
//     );
//     spyOn(TestBed.inject(ConfigService), 'getContextPath').and.returnValue('wise.berkeley.edu');
//   });

//   it('should make a GET request to the log out URL when logOut() is called', fakeAsync(() => {
//     service.logOut();
//     tick();
//     expect(httpSpy).toHaveBeenCalledWith('api/logOutUrl');
//     expect(routerSpy).toHaveBeenCalledWith('wise.berkeley.edu');
//   }));
// });
