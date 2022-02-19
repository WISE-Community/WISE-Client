import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { UtilService } from '../../../services/utilService';
import { DialogResponsesComponent } from '../dialog-responses/dialog-responses.component';
import { DialogGuidanceShowWorkComponent } from './dialog-guidance-show-work.component';

describe('DialogGuidanceShowWorkComponent', () => {
  let component: DialogGuidanceShowWorkComponent;
  let fixture: ComponentFixture<DialogGuidanceShowWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [DialogGuidanceShowWorkComponent, DialogResponsesComponent],
      providers: [ConfigService, ComputerAvatarService, ProjectService, SessionService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceShowWorkComponent);
    component = fixture.componentInstance;
    component.componentState = {
      studentData: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
