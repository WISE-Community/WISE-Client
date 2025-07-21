import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '../../../assets/wise5/common/Component';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditCommonAdvancedComponent } from './edit-common-advanced.component';
import { MockComponent, MockProviders } from 'ng-mocks';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { EditComponentJsonComponent } from '../edit-component-json/edit-component-json.component';

describe('EditCommonAdvancedComponent', () => {
  let component: EditCommonAdvancedComponent;
  let fixture: ComponentFixture<EditCommonAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditCommonAdvancedComponent, MockComponent(EditComponentJsonComponent)],
    providers: [MockProviders(NotificationService, ProjectService, TeacherProjectService)]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommonAdvancedComponent);
    component = fixture.componentInstance;
    component.component = { content: {} } as Component;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
