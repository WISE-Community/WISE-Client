import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponentComponent } from './select-component.component';
import { MockProvider } from 'ng-mocks';
import { ProjectService } from '../../../assets/wise5/services/projectService';

describe('SelectComponentComponent', () => {
  let component: SelectComponentComponent;
  let fixture: ComponentFixture<SelectComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponentComponent],
      providers: [MockProvider(ProjectService)]
    });
    fixture = TestBed.createComponent(SelectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
