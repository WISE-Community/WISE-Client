import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentHeader } from './component-header.component';
import { DomSanitizer } from '@angular/platform-browser';
import { PromptComponent } from '../prompt/prompt.component';
import { DynamicPromptComponent } from '../dynamic-prompt/dynamic-prompt.component';
import { ComponentContent } from '../../common/ComponentContent';
import { Component } from '../../common/Component';

let component: ComponentHeader;
let fixture: ComponentFixture<ComponentHeader>;

describe('ComponentHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentHeader, DynamicPromptComponent, PromptComponent],
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
});
