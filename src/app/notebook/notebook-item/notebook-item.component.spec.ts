import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { NotebookItemComponent } from './notebook-item.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: NotebookItemComponent;
describe('NotebookItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotebookItemComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    });
    const fixture = TestBed.createComponent(NotebookItemComponent);
    component = fixture.componentInstance;
    component.note = { type: 'note', content: { attachments: [] } };
    component.config = { itemTypes: { note: { label: 'note!' } } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
