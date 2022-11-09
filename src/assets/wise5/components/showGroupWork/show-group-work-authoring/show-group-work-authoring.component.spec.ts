import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ShowGroupWorkAuthoringComponent } from './show-group-work-authoring.component';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../../common/ComponentContent';

describe('ShowGroupWorkAuthoringComponent', () => {
  let component: ShowGroupWorkAuthoringComponent;
  let fixture: ComponentFixture<ShowGroupWorkAuthoringComponent>;
  const nodeId1 = 'node1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        UpgradeModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [EditComponentPrompt, ShowGroupWorkAuthoringComponent],
      providers: [ProjectAssetService, TeacherProjectService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGroupWorkAuthoringComponent);
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      {} as ComponentContent
    );
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      nodeId1
    ]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
