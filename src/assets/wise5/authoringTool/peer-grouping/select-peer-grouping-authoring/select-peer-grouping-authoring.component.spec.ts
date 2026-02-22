import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { SelectPeerGroupingAuthoringComponent } from './select-peer-grouping-authoring.component';
import { provideHttpClient } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';

let component: SelectPeerGroupingAuthoringComponent;
let fixture: ComponentFixture<SelectPeerGroupingAuthoringComponent>;
let peerGrouping1: PeerGrouping;
const tag1: string = 'tag1';
describe('SelectPeerGroupingAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule, SelectPeerGroupingAuthoringComponent],
      providers: [MockProvider(PeerGroupingAuthoringService), provideHttpClient()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingAuthoringComponent);
    component = fixture.componentInstance;
    peerGrouping1 = new PeerGrouping({ tag: tag1 });
    spyOn(TestBed.inject(PeerGroupingAuthoringService), 'getPeerGrouping').and.returnValue(
      peerGrouping1
    );
    fixture.detectChanges();
  });

  selectGroupingLogic();
});

function selectGroupingLogic() {
  it('should select grouping logic', () => {
    const dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open');
    component.selectGroupingLogic();
    expect(dialogOpenSpy).toHaveBeenCalled();
  });
}
