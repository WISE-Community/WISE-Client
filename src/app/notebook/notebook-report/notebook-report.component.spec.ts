import { TestBed } from '@angular/core/testing';
import { NotebookReportComponent } from './notebook-report.component';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: NotebookReportComponent;
describe('NotebookReportComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotebookReportComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    });
    const fixture = TestBed.createComponent(NotebookReportComponent);
    component = fixture.componentInstance;
    component.config = createConfig();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function createConfig() {
  return {
    itemTypes: {
      note: {
        enabled: true
      }
    }
  };
}
