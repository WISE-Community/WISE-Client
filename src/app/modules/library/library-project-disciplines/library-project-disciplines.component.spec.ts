import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LibraryProjectDisciplinesComponent } from './library-project-disciplines.component';
import { LibraryProject } from '../libraryProject';

describe('LibraryProjectDisciplinesComponent', () => {
  let component: LibraryProjectDisciplinesComponent;
  let fixture: ComponentFixture<LibraryProjectDisciplinesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [LibraryProjectDisciplinesComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryProjectDisciplinesComponent);
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
