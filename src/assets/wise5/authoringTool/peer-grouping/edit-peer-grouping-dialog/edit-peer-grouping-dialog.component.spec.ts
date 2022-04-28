import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { PeerGroupingSettings } from '../peerGroupingSettings';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog.component';

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

  savePeerGroupingSettings();
  deletePeerGroupingSettings();
  cancelPeerGroupingSettings();
});

function savePeerGroupingSettings() {
  it('should save peer grouping settings', async () => {
    const settings = new PeerGroupingSettings();
    component.settings = settings;
    const updatePeerGroupingSettingsSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'updatePeerGroupingSettings'
    ).and.returnValue(of(settings));
    component.save();
    expect(updatePeerGroupingSettingsSpy).toHaveBeenCalledWith(settings);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}

function deletePeerGroupingSettings() {
  it('should delete peer grouping settings', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.delete();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}

function cancelPeerGroupingSettings() {
  it('should cancel peer grouping settings', () => {
    component.cancel();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}
