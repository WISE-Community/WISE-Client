import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LibraryProjectComponent } from './library-project.component';
import { LibraryProject } from '../libraryProject';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { ProjectTagService } from '../../../../assets/wise5/services/projectTagService';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LibraryProjectComponent', () => {
  let component: LibraryProjectComponent;
  let fixture: ComponentFixture<LibraryProjectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LibraryProjectComponent],
        imports: [BrowserAnimationsModule, HttpClientTestingModule, MatDialogModule, OverlayModule],
        providers: [ProjectTagService, provideRouter([])],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryProjectComponent);
    component = fixture.componentInstance;
    const project: LibraryProject = new LibraryProject();
    project.id = 1;
    project.type = 'project';
    project.notes = 'Testing Project';
    project.metadata = {
      standardsAddressed: {
        ngss: {
          discipline: {
            id: 'LS',
            name: 'Life Sciences'
          }
        }
      }
    };
    project.projectThumb = '';
    project.thumbStyle = '';
    component.project = project;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
