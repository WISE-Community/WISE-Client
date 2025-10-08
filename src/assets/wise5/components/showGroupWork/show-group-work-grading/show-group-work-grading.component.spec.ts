import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowGroupWorkGradingComponent } from './show-group-work-grading.component';
import { MockComponent, MockProviders } from 'ng-mocks';
import { ShowGroupWorkDisplayComponent } from '../show-group-work-display/show-group-work-display.component';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';

describe('ShowGroupWorkGradingComponent', () => {
  let component: ShowGroupWorkGradingComponent;
  let fixture: ComponentFixture<ShowGroupWorkGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowGroupWorkGradingComponent, MockComponent(ShowGroupWorkDisplayComponent)],
      providers: [MockProviders(NodeService, ProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowGroupWorkGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
