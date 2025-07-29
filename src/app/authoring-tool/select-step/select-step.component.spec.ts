import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectStepComponent } from './select-step.component';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { MockProvider } from 'ng-mocks';

describe('SelectStepComponent', () => {
  let component: SelectStepComponent;
  let fixture: ComponentFixture<SelectStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectStepComponent],
      providers: [MockProvider(ProjectService)]
    });
    fixture = TestBed.createComponent(SelectStepComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ProjectService), 'getStepNodeIds').and.returnValue(['node1']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
