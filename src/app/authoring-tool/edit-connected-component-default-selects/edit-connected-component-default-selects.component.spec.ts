import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditConnectedComponentDefaultSelectsComponent } from './edit-connected-component-default-selects.component';
import { MockComponents, MockProvider } from 'ng-mocks';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { SelectStepAndComponentComponent } from '../select-step-and-component/select-step-and-component.component';
import { EditConnectedComponentTypeSelectComponent } from '../edit-connected-component-type-select/edit-connected-component-type-select.component';

describe('EditConnectedComponentDefaultSelectsComponent', () => {
  let component: EditConnectedComponentDefaultSelectsComponent;
  let fixture: ComponentFixture<EditConnectedComponentDefaultSelectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EditConnectedComponentDefaultSelectsComponent, MockComponents(EditConnectedComponentTypeSelectComponent, SelectStepAndComponentComponent)],
    providers: [MockProvider(ProjectService)]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentDefaultSelectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
