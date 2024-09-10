import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { NotebookNotesComponent } from './notebook-notes.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: NotebookNotesComponent;
describe('NotebookNotesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotebookNotesComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    });
    const fixture = TestBed.createComponent(NotebookNotesComponent);
    component = fixture.componentInstance;
  });

  isHasPrivateNotes();
});

function isHasPrivateNotes() {
  it('should check if the notebook has private notes when it does not have any notes', () => {
    component.notebook = { items: {} };
    component.addPersonalGroupToGroups();
    expect(component.isHasPrivateNotes()).toEqual(false);
  });
  it('should check if the notebook has private notes when it has a note', () => {
    component.notebook = { items: { abcd: [{ type: 'note' }] } };
    component.addPersonalGroupToGroups();
    expect(component.isHasPrivateNotes()).toEqual(true);
  });
}
