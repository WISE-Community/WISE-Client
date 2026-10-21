import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CallToActionComponent } from './call-to-action.component';

@Component({
  imports: [CallToActionComponent],
  template: `
    <app-call-to-action destination="/test">
      <ng-template #headlineTemplate>
        <span class="custom-headline">Custom Projected Headline</span>
      </ng-template>
      <ng-template #contentTemplate>
        <span class="custom-content">Custom Projected Content</span>
      </ng-template>
    </app-call-to-action>
  `
})
class TestHostComponent {}

describe('CallToActionComponent', () => {
  let component: CallToActionComponent;
  let fixture: ComponentFixture<CallToActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CallToActionComponent, TestHostComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallToActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render headline, content, and icon from inputs', () => {
    fixture.componentRef.setInput('headline', 'Student');
    fixture.componentRef.setInput('content', 'Reset password for student account');
    fixture.componentRef.setInput('icon', 'school');
    fixture.componentRef.setInput('iconColor', 'accent');
    fixture.detectChanges();

    const headlineEl = fixture.nativeElement.querySelector('.cta__headline');
    const contentEl = fixture.nativeElement.querySelector('.cta__tagline');
    const iconEl = fixture.nativeElement.querySelector('.cta__icon');

    expect(headlineEl.textContent).toContain('Student');
    expect(contentEl.textContent).toContain('Reset password for student account');
    expect(iconEl.textContent.trim()).toBe('school');
    expect(iconEl.classList.contains('accent')).toBeTrue();
  });

  it('should render svgIcon when isSvgIcon is true', () => {
    fixture.componentRef.setInput('icon', 'custom-svg-icon');
    fixture.componentRef.setInput('isSvgIcon', true);
    fixture.detectChanges();

    const iconDebugEl = fixture.debugElement.query(By.css('.cta__icon'));
    const matIconComponent = iconDebugEl.componentInstance as MatIcon;
    expect(matIconComponent.svgIcon).toBe('custom-svg-icon');
  });

  it('should render routerLink when isOutsideLink is false', () => {
    fixture.componentRef.setInput('destination', '/student');
    fixture.componentRef.setInput('isOutsideLink', false);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a.cta');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('/student');
  });

  it('should render external link with href and target when isOutsideLink is true', () => {
    fixture.componentRef.setInput('destination', 'https://wise.berkeley.edu');
    fixture.componentRef.setInput('linkTarget', '_blank');
    fixture.componentRef.setInput('isOutsideLink', true);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a.cta');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('https://wise.berkeley.edu');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('should render custom projected templates when provided', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const customHeadline = hostFixture.nativeElement.querySelector('.custom-headline');
    const customContent = hostFixture.nativeElement.querySelector('.custom-content');

    expect(customHeadline).not.toBeNull();
    expect(customHeadline.textContent).toBe('Custom Projected Headline');
    expect(customContent).not.toBeNull();
    expect(customContent.textContent).toBe('Custom Projected Content');
  });
});
