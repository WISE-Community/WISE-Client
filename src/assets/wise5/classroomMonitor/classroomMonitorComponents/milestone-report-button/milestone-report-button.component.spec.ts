import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MilestoneReportButtonComponent } from './milestone-report-button.component';
import { MockProvider } from 'ng-mocks';
import { MilestoneService } from '../../../services/milestoneService';
import { Node } from '../../../common/Node';

let component: MilestoneReportButtonComponent;
let fixture: ComponentFixture<MilestoneReportButtonComponent>;
let milestoneService: MilestoneService;
describe('MilestoneReportButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneReportButtonComponent],
      providers: [MockProvider(MilestoneService)]
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneReportButtonComponent);
    component = fixture.componentInstance;
    component.node = { id: 'node1' } as Node;
    component.component = { id: 'abc' };
    milestoneService = TestBed.inject(MilestoneService);
    fixture.detectChanges();
  });
  reportAvailable();
  reportNotAvailable();
});

function reportAvailable() {
  describe('report is available', () => {
    it('should show button', () => {
      spyOn(milestoneService, 'getMilestoneReport').and.returnValue({
        isReportAvailable: true
      });
      component.ngOnChanges();
      fixture.detectChanges();
      const button = fixture.debugElement.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });
  });
}

function reportNotAvailable() {
  describe('report is not available', () => {
    it('should hide button', () => {
      const button = fixture.debugElement.nativeElement.querySelector('button');
      expect(button).toBeFalsy();
    });
  });
}
