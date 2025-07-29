import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditComponentConstraintsComponent } from './edit-component-constraints.component';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';
import { MockProvider } from 'ng-mocks';

describe('EditComponentConstraintsComponent', () => {
  let component: EditComponentConstraintsComponent;
  let fixture: ComponentFixture<EditComponentConstraintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComponentConstraintsComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponentConstraintsComponent);
    component = fixture.componentInstance;
    component.componentContent = {} as ComponentContent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
