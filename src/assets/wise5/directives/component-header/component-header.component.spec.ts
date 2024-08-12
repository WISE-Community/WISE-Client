import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentHeaderComponent } from './component-header.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentContent } from '../../common/ComponentContent';
import { Component } from '../../common/Component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectService } from '../../services/projectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: ComponentHeaderComponent;
let fixture: ComponentFixture<ComponentHeaderComponent>;

describe('ComponentHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [ComponentHeaderComponent,
        StudentTeacherCommonServicesModule],
    providers: [
        {
            provide: DomSanitizer,
            useValue: {
                bypassSecurityTrustHtml: (val: string) => val
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
