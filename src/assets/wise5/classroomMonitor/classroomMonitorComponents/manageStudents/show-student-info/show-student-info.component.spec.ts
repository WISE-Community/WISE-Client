import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../services/configService';
import { ShowStudentInfoComponent } from './show-student-info.component';
import { By } from '@angular/platform-browser';

class ConfigServiceStub {
  getPermissions() {}
  getRunId() {
    return 123;
  }
}

let configService: ConfigService;
let fixture: ComponentFixture<ShowStudentInfoComponent>;
let component: ShowStudentInfoComponent;
describe('ShowStudentInfoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowStudentInfoComponent],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }]
    }).compileComponents();
  });

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    fixture = TestBed.createComponent(ShowStudentInfoComponent);
    component = fixture.componentInstance;
    component.user = { id: 1, name: 'oski bear', username: 'oskib0101' };
  });
  userNameDisplay();
});

function userNameDisplay() {
  describe('user name', () => {
    it('should show username when user has ViewStudentNames permission', () => {
      spyOnCanViewStudentNames(true);
      fixture.detectChanges();
      expect(getUsername()).toEqual('oski bear (oskib0101)');
    });
    it('should show user id when user does not have ViewStudentNames permission', () => {
      spyOnCanViewStudentNames(false);
      fixture.detectChanges();
      expect(getUsername()).toEqual('Student 1');
    });
  });
}

function spyOnCanViewStudentNames(canView: boolean) {
  spyOn(configService, 'getPermissions').and.returnValue({
    canGradeStudentWork: true,
    canViewStudentNames: canView,
    canAuthorProject: true
  });
}

function getUsername(): string {
  return fixture.debugElement.query(By.css('.username')).nativeElement.textContent;
}
