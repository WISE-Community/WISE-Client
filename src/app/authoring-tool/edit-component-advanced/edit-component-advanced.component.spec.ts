import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProviders } from 'ng-mocks';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';
import { EditShowMyWorkAdvancedComponent } from '../../../assets/wise5/components/showMyWork/edit-show-my-work-advanced/edit-show-my-work-advanced.component';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { TeacherNodeService } from '../../../assets/wise5/services/teacherNodeService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditComponentAdvancedComponent } from './edit-component-advanced.component';
import { ComponentServiceLookupService } from '../../../assets/wise5/services/componentServiceLookupService';
import { Component } from '../../../assets/wise5/common/Component';

let component: EditComponentAdvancedComponent;
let fixture: ComponentFixture<EditComponentAdvancedComponent>;
describe('EditComponentAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent(EditShowMyWorkAdvancedComponent), EditComponentAdvancedComponent],
      providers: [
        MockProviders(
          ComponentServiceLookupService,
          TeacherNodeService,
          NotebookService,
          NotificationService,
          TeacherProjectService
        )
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponentAdvancedComponent);
    component = fixture.componentInstance;
    component.component = {
      id: 'component1',
      nodeId: 'node1',
      content: { type: 'ShowMyWork' }
    } as Component;
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue({
      type: 'ShowMyWork'
    } as ComponentContent);
    spyOn(TestBed.inject(TeacherProjectService), 'getProject').and.returnValue({});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
