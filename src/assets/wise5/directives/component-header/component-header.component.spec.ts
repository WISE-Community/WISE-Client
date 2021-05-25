import { configureTestSuite } from 'ng-bullet';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentHeader } from './component-header.component';
import { DomSanitizer } from '@angular/platform-browser';

let component: ComponentHeader;
let fixture: ComponentFixture<ComponentHeader>;

describe('ComponentHeader', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentHeader],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (val: string) => val
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should show prompt', () => {
    fixture = TestBed.createComponent(ComponentHeader);
    component = fixture.componentInstance;
    component.componentContent = { prompt: '<h3>Prompt goes here</h3>' };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.prompt').textContent).toBe('Prompt goes here');
  });
});
