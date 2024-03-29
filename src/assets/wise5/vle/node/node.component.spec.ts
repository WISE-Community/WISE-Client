import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfigService } from '../../services/configService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../vleProjectService';
import { NodeComponent } from './node.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';

let component: NodeComponent;
let fixture: ComponentFixture<NodeComponent>;

describe('NodeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [NodeComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    spyOn(TestBed.inject(ConfigService), 'isRunActive').and.returnValue(true);
    spyOn(TestBed.inject(StudentDataService), 'getCurrentNode').and.returnValue({});
    spyOn(TestBed.inject(StudentDataService), 'getNodeStatusByNodeId').and.returnValue({});
    spyOn(TestBed.inject(StudentDataService), 'saveVLEEvent').and.callFake(() => {
      return Promise.resolve({});
    });
    spyOn(TestBed.inject(VLEProjectService), 'isApplicationNode').and.returnValue(true);
    spyOn(TestBed.inject(VLEProjectService), 'getNodeById').and.returnValue({ components: [] });
    spyOn(TestBed.inject(VLEProjectService), 'getNodeTitle').and.returnValue('');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
