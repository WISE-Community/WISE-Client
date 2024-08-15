import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfigService } from '../../services/configService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../vleProjectService';
import { NodeComponent } from './node.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { Node } from '../../common/Node';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: NodeComponent;
let fixture: ComponentFixture<NodeComponent>;

describe('NodeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeComponent],
      imports: [MatDialogModule, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
    component.node = new Node();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
