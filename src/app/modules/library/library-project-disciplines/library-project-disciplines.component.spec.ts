import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LibraryProjectDisciplinesComponent } from './library-project-disciplines.component';
import { LibraryProject } from '../libraryProject';

describe('LibraryProjectDisciplinesComponent', () => {
  let component: LibraryProjectDisciplinesComponent;
  let fixture: ComponentFixture<LibraryProjectDisciplinesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LibraryProjectDisciplinesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryProjectDisciplinesComponent);
    component = fixture.componentInstance;
    const project: LibraryProject = new LibraryProject();
    project.id = 1;
    project.type = 'project';
    project.notes = 'Testing Project';
    project.metadata = {
      disciplines: [
        { id: 'LS', name: 'Life Sciences' },
        { id: 'ESS', name: 'Earth and Space Sciences' }
      ]
    };
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render discipline badges with assigned colors', () => {
    const badges = fixture.nativeElement.querySelectorAll('.library-project-disciplines__icon');
    expect(badges.length).toBe(2);
    expect(badges[0].textContent.trim()).toBe('LS');
    expect(badges[0].style.backgroundColor).toBe('rgb(216, 27, 96)'); // #D81B60
    expect(badges[1].textContent.trim()).toBe('ESS');
    expect(badges[1].style.backgroundColor).toBe('rgb(46, 125, 50)'); // #2E7D32
  });

  it('should render nothing when disciplines list is empty', () => {
    const project: LibraryProject = new LibraryProject();
    project.metadata = { disciplines: [] };
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll('.library-project-disciplines__icon');
    expect(badges.length).toBe(0);
  });
});
