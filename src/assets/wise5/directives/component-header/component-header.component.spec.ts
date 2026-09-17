import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '../../common/Component';
import { ComponentContent } from '../../common/ComponentContent';
import { ComponentHeaderComponent } from './component-header.component';
import { MockProvider } from 'ng-mocks';
import { ProjectService } from '../../services/projectService';
import { ThemeSettings } from '../../common/ThemeSettings';

let component: ComponentHeaderComponent;
let fixture: ComponentFixture<ComponentHeaderComponent>;
describe('ComponentHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComponentHeaderComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val
          }
        },
        MockProvider(ProjectService)
      ]
    });
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue(new ThemeSettings());
  });

  it('should show prompt', () => {
    fixture = TestBed.createComponent(ComponentHeaderComponent);
    component = fixture.componentInstance;
    component.component = new Component(
      {
        prompt: '<h3>Prompt goes here</h3>'
      } as ComponentContent,
      'node1'
    );
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.prompt').textContent).toBe('Prompt goes here');
  });

  it('should show title and icon when showComponentTitles and showComponentTypeIcons are true', () => {
    (TestBed.inject(ProjectService).getThemeSettings as jasmine.Spy).and.returnValue(
      new ThemeSettings({ showComponentTitles: true, showComponentTypeIcons: true })
    );
    fixture = TestBed.createComponent(ComponentHeaderComponent);
    component = fixture.componentInstance;
    component.component = new Component(
      {
        type: 'OpenResponse',
        title: 'Activity 1'
      } as ComponentContent,
      'node1'
    );
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.mat-headline-6')).toBeTruthy();
    expect(compiled.querySelector('.mat-headline-6').textContent).toContain('Activity 1');
    expect(compiled.querySelector('mat-icon')).toBeTruthy();
  });

  it('should show title without icon when showComponentTitles is true and showComponentTypeIcons is false', () => {
    (TestBed.inject(ProjectService).getThemeSettings as jasmine.Spy).and.returnValue(
      new ThemeSettings({ showComponentTitles: true, showComponentTypeIcons: false })
    );
    fixture = TestBed.createComponent(ComponentHeaderComponent);
    component = fixture.componentInstance;
    component.component = new Component(
      {
        type: 'OpenResponse',
        title: 'Activity 1'
      } as ComponentContent,
      'node1'
    );
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.mat-headline-6')).toBeTruthy();
    expect(compiled.querySelector('.mat-headline-6').textContent).toContain('Activity 1');
    expect(compiled.querySelector('mat-icon')).toBeFalsy();
  });

  it('should not show title or icon when showComponentTitles is false', () => {
    (TestBed.inject(ProjectService).getThemeSettings as jasmine.Spy).and.returnValue(
      new ThemeSettings({ showComponentTitles: false, showComponentTypeIcons: true })
    );
    fixture = TestBed.createComponent(ComponentHeaderComponent);
    component = fixture.componentInstance;
    component.component = new Component(
      {
        type: 'OpenResponse',
        title: 'Activity 1'
      } as ComponentContent,
      'node1'
    );
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.mat-headline-6')).toBeFalsy();
    expect(compiled.querySelector('mat-icon')).toBeFalsy();
  });
});
