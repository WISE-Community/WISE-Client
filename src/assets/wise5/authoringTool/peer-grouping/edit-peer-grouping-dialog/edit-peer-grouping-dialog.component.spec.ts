import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog.component';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';

let component: EditPeerGroupingDialogComponent;
let dialogCloseSpy: jasmine.Spy;
let fixture: ComponentFixture<EditPeerGroupingDialogComponent>;

describe('EditPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
      declarations: [EditPeerGroupingDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            settings: {},
            stepsUsedIn: []
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    dialogCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    fixture.detectChanges();
  });

  savePeerGrouping();
  deletePeerGrouping();
  cancelPeerGrouping();
});

function savePeerGrouping() {
  it('should save peer grouping', async () => {
    const settings = new PeerGrouping();
    component.peerGrouping = settings;
    const updatePeerGroupingSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'updatePeerGrouping'
    ).and.returnValue(of(settings));
    component.save();
    expect(updatePeerGroupingSpy).toHaveBeenCalledWith(settings);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}

function deletePeerGrouping() {
  it('should delete peer grouping', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.delete();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}

function cancelPeerGrouping() {
  it('should cancel peer grouping', () => {
    component.cancel();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}
