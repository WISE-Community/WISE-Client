import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotUserPasswordCompleteComponent } from './forgot-user-password-complete.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { provideRouter, Router } from '@angular/router';

let loader: HarnessLoader;
describe('ForgotUserPasswordCompleteComponent', () => {
  let component: ForgotUserPasswordCompleteComponent;
  let fixture: ComponentFixture<ForgotUserPasswordCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForgotUserPasswordCompleteComponent],
      providers: [provideRouter([])]
    });
    fixture = TestBed.createComponent(ForgotUserPasswordCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should go go the sign in page when the sign in button is clicked', async () => {
    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
    const username = 'SpongebobSquarepants';
    component.username = username;
    await (await loader.getHarness(MatButtonHarness)).click();
    expect(navigateSpy).toHaveBeenCalledWith([
      '/login',
      {
        username: username
      }
    ]);
  });
});
