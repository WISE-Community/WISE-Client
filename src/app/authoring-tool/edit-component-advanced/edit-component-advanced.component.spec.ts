import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockComponent, MockProviders } from 'ng-mocks';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';
import { EditShowMyWorkAdvancedComponent } from '../../../assets/wise5/components/showMyWork/edit-show-my-work-advanced/edit-show-my-work-advanced.component';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { TeacherNodeService } from '../../../assets/wise5/services/teacherNodeService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditComponentAdvancedComponent } from './edit-component-advanced.component';

let component: EditComponentAdvancedComponent;
let fixture: ComponentFixture<EditComponentAdvancedComponent>;
describe('EditComponentAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent(EditShowMyWorkAdvancedComponent), EditComponentAdvancedComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            component: {
              content: { type: 'ShowMyWork' },
              id: 'component1',
              nodeId: 'node1'
            },
            tab: 'general'
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        },
        MockProviders(
          TeacherNodeService,
          NotebookService,
          NotificationService,
          TeacherProjectService
        )
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponentAdvancedComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue({
      type: 'ShowMyWork'
    } as ComponentContent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
