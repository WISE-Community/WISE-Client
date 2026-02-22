import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockComponent, MockProviders } from 'ng-mocks';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { SelectPeerGroupingOptionComponent } from '../select-peer-grouping-option/select-peer-grouping-option.component';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog.component';
import { provideHttpClient } from '@angular/common/http';

let component: SelectPeerGroupingDialogComponent;
let fixture: ComponentFixture<SelectPeerGroupingDialogComponent>;
let peerGrouping1: PeerGrouping;
let peerGrouping2: PeerGrouping;
const tag1: string = 'tag1';
const tag2: string = 'tag2';
describe('SelectPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StudentTeacherCommonServicesModule,
        SelectPeerGroupingDialogComponent,
        MockComponent(SelectPeerGroupingOptionComponent)
      ],
      providers: [
        MockProviders(PeerGroupingAuthoringService, TeacherProjectService),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: MatDialogRef,
          useValue: { close: () => {} }
        },
        provideHttpClient()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    peerGrouping1 = new PeerGrouping({ tag: tag1 });
    peerGrouping2 = new PeerGrouping({ tag: tag2 });
    spyOn(TestBed.inject(PeerGroupingAuthoringService), 'getPeerGroupings').and.returnValue([]);
    fixture.detectChanges();
  });
  deletePeerGrouping();
});

function deletePeerGrouping() {
  it('should delete peer grouping', () => {
    component.peerGroupings = [peerGrouping1, peerGrouping2];
    const deletePeerGroupingSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'deletePeerGrouping'
    );
    component.deletePeerGrouping(peerGrouping2);
    expect(deletePeerGroupingSpy).toHaveBeenCalledWith(peerGrouping2);
  });
}
