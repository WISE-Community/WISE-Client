import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockComponent, MockProviders } from 'ng-mocks';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditComponentAdvancedComponent } from './edit-component-advanced.component';
import { EditComponentJsonComponent } from '../edit-component-json/edit-component-json.component';

let component: EditComponentAdvancedComponent;
let fixture: ComponentFixture<EditComponentAdvancedComponent>;
describe('EditComponentAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent(EditComponentJsonComponent), EditComponentAdvancedComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            content: { type: 'ShowMyWork' },
            id: 'component1',
            nodeId: 'node1'
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        },
        StudentTeacherCommonServicesModule,
        MockProviders(NotificationService, TeacherProjectService),
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponentAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
