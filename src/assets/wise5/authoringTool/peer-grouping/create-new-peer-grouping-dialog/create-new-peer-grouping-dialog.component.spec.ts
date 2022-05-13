import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog.component';

let component: CreateNewPeerGroupingDialogComponent;
let fixture: ComponentFixture<CreateNewPeerGroupingDialogComponent>;
const tag1: string = 'tag1';

describe('CreateNewPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, PeerGroupingTestingModule],
      declarations: [CreateNewPeerGroupingDialogComponent],
      providers: []
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
  it('should create peer grouping', async () => {
    spyOn(TestBed.inject(PeerGroupingAuthoringService), 'getUniqueTag').and.returnValue(tag1);
    const newPeerGrouping = new PeerGrouping({
      logic: 'random',
      maxMembershipCount: 2,
      tag: tag1
    });
    const createNewPeerGroupingSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'createNewPeerGrouping'
    ).and.returnValue(of(newPeerGrouping));
    const dialogCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    component.create();
    expect(createNewPeerGroupingSpy).toHaveBeenCalledWith(newPeerGrouping);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}
