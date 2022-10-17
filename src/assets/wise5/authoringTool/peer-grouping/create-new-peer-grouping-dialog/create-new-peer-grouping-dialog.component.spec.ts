import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { ReferenceComponent } from '../../../../../app/domain/referenceComponent';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog.component';

let component: CreateNewPeerGroupingDialogComponent;
let fixture: ComponentFixture<CreateNewPeerGroupingDialogComponent>;
const TAG1: string = 'tag1';
const REFERENCE_COMPONENT_NODE_ID1 = 'node1';
const REFERENCE_COMPONENT_COMPONENT_ID1 = 'component1';

describe('CreateNewPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, PeerGroupingTestingModule, StudentTeacherCommonServicesModule],
      declarations: [CreateNewPeerGroupingDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  create();
});

function create() {
  it('should create peer grouping with random logic', async () => {
    spyOn(TestBed.inject(PeerGroupingAuthoringService), 'getUniqueTag').and.returnValue(TAG1);
    const newPeerGrouping = new PeerGrouping({
      logic: 'random',
      maxMembershipCount: 2,
      tag: TAG1
    });
    const createNewPeerGroupingSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'createNewPeerGrouping'
    ).and.returnValue(of(newPeerGrouping));
    const dialogCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    component.logicType = 'random';
    component.create();
    expect(createNewPeerGroupingSpy).toHaveBeenCalledWith(newPeerGrouping);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });

  it('should create peer grouping with different ideas logic', async () => {
    spyOn(TestBed.inject(PeerGroupingAuthoringService), 'getUniqueTag').and.returnValue(TAG1);
    const newPeerGrouping = new PeerGrouping({
      logic: `differentIdeas("${REFERENCE_COMPONENT_NODE_ID1}", "${REFERENCE_COMPONENT_COMPONENT_ID1}")`,
      maxMembershipCount: 2,
      tag: TAG1
    });
    const createNewPeerGroupingSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'createNewPeerGrouping'
    ).and.returnValue(of(newPeerGrouping));
    const dialogCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    component.logicType = 'differentIdeas';
    component.referenceComponent = new ReferenceComponent(
      REFERENCE_COMPONENT_NODE_ID1,
      REFERENCE_COMPONENT_COMPONENT_ID1
    );
    component.create();
    expect(createNewPeerGroupingSpy).toHaveBeenCalledWith(newPeerGrouping);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}
