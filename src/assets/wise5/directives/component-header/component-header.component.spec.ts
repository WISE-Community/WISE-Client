import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '../../common/Component';
import { ComponentContent } from '../../common/ComponentContent';
import { ComponentHeaderComponent } from './component-header.component';
import { MockProvider } from 'ng-mocks';
import { ProjectService } from '../../services/projectService';

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
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
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
});
