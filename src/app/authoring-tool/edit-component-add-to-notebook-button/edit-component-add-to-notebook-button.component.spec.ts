import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditComponentAddToNotebookButtonComponent } from './edit-component-add-to-notebook-button.component';
import { MockProvider } from 'ng-mocks';

describe('EditComponentAddToNotebookButtonComponent', () => {
  let component: EditComponentAddToNotebookButtonComponent;
  let fixture: ComponentFixture<EditComponentAddToNotebookButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComponentAddToNotebookButtonComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentAddToNotebookButtonComponent);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
