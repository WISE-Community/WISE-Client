import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { PeerGroupingSettings } from '../peerGroupingSettings';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog.component';

let component: CreateNewPeerGroupingDialogComponent;
let fixture: ComponentFixture<CreateNewPeerGroupingDialogComponent>;
const tag1: string = 'tag1';

describe('CreateNewPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
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
  it('should create peer grouping settings', async () => {
    spyOn(TestBed.inject(PeerGroupingAuthoringService), 'getUniqueTag').and.returnValue(tag1);
    const newPeerGroupingSettings = new PeerGroupingSettings({
      logic: 'random',
      maxMembershipCount: 2,
      tag: tag1
    });
    const createNewPeerGroupingSettingsSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'createNewPeerGroupingSettings'
    ).and.returnValue(of(newPeerGroupingSettings));
    const dialogCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    component.create();
    expect(createNewPeerGroupingSettingsSpy).toHaveBeenCalledWith(newPeerGroupingSettings);
    expect(dialogCloseSpy).toHaveBeenCalledWith(newPeerGroupingSettings);
  });
}
