import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectInfoAuthoringComponent } from './project-info-authoring.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ConfigService } from '../../services/configService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UserService } from '../../../../app/services/user.service';
import { MockComponent, MockProviders } from 'ng-mocks';
import { EditProjectLanguageSettingComponent } from '../project-info/edit-project-language-setting/edit-project-language-setting.component';
import { EditUnitResourcesComponent } from '../edit-unit-resources/edit-unit-resources.component';
import { ThemeSettings } from '../../common/ThemeSettings';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ProjectInfoAuthoringComponent', () => {
  let component: ProjectInfoAuthoringComponent;
  let fixture: ComponentFixture<ProjectInfoAuthoringComponent>;
  let teacherProjectService: TeacherProjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ProjectInfoAuthoringComponent,
        MockComponent(EditProjectLanguageSettingComponent),
        MockComponent(EditUnitResourcesComponent)
      ],
      providers: [
        MockProviders(ConfigService, TeacherProjectService, UserService),
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();

    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'getProjectMetadata').and.returnValue({
      authors: [],
      resources: []
    });
    spyOn(teacherProjectService, 'getThemeSettings').and.returnValue(new ThemeSettings());
    spyOn(teacherProjectService, 'saveProject').and.stub();
    spyOn(TestBed.inject(ConfigService), 'getConfigParam').and.returnValue('{ "fields": [] }');
    spyOn(TestBed.inject(UserService), 'getUserId').and.returnValue(1);

    fixture = TestBed.createComponent(ProjectInfoAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize themeSettings on init', () => {
    expect(component['themeSettings']).toBeDefined();
    expect(component['themeSettings'].showComponentTitles).toBeTrue();
    expect(component['themeSettings'].showComponentTypeIcons).toBeTrue();
  });

  it('should save project when save is called', () => {
    component['save']();
    expect(teacherProjectService.saveProject).toHaveBeenCalled();
  });

  describe('Theme tab slide toggles', () => {
    beforeEach(() => {
      const tabGroup = fixture.debugElement.query(By.css('mat-tab-group')).componentInstance;
      tabGroup.selectedIndex = 1;
      fixture.detectChanges();
    });

    it('should display slide-toggles when theme tab is rendered', () => {
      const toggles = fixture.debugElement.queryAll(By.css('mat-slide-toggle'));
      expect(toggles.length).toBe(2);
      expect(toggles[0].nativeElement.textContent).toContain('Show activity titles');
      expect(toggles[1].nativeElement.textContent).toContain('Show activity icons');
    });

    it('should hide activity type icons toggle when showComponentTitles is false', () => {
      component['themeSettings'].showComponentTitles = false;
      fixture.detectChanges();
      const toggles = fixture.debugElement.queryAll(By.css('mat-slide-toggle'));
      expect(toggles.length).toBe(1);
      expect(toggles[0].nativeElement.textContent).toContain('Show activity titles');
    });

    it('should show activity type icons toggle when showComponentTitles is true', () => {
      component['themeSettings'].showComponentTitles = false;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('mat-slide-toggle')).length).toBe(1);
      component['themeSettings'].showComponentTitles = true;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('mat-slide-toggle')).length).toBe(2);
    });

    it('should call saveProject when save is invoked from slide toggle change', () => {
      component['save']();
      expect(teacherProjectService.saveProject).toHaveBeenCalled();
    });
  });
});
