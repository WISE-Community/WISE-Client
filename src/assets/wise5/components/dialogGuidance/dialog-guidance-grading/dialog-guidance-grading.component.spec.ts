import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { UtilService } from '../../../services/utilService';
import { DialogResponsesComponent } from '../dialog-responses/dialog-responses.component';
import { DialogGuidanceGradingComponent } from './dialog-guidance-grading.component';

describe('DialogGuidanceGradingComponent', () => {
  let component: DialogGuidanceGradingComponent;
  let fixture: ComponentFixture<DialogGuidanceGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [DialogGuidanceGradingComponent, DialogResponsesComponent],
      providers: [ConfigService, ProjectService, SessionService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceGradingComponent);
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
