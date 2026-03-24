import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleComponentTagComponent } from './toggle-component-tag.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentContent } from '../../../common/ComponentContent';

describe('ToggleComponentTagComponent', () => {
  let component: ToggleComponentTagComponent;
  let fixture: ComponentFixture<ToggleComponentTagComponent>;
  let mockProjectService: jasmine.SpyObj<TeacherProjectService>;

  beforeEach(async () => {
    mockProjectService = jasmine.createSpyObj('TeacherProjectService', ['saveProject']);

    await TestBed.configureTestingModule({
      imports: [ToggleComponentTagComponent],
      providers: [{ provide: TeacherProjectService, useValue: mockProjectService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleComponentTagComponent);
    component = fixture.componentInstance;
    component.component = { id: 'test', type: 'OpenResponse' } as ComponentContent;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set hasTag to false and update tooltip if tag is not present', () => {
      component.component.tags = ['other-tag'];
      fixture.detectChanges();

      expect(component['hasTag']).toBeFalse();
      expect(component['tooltip']).toEqual('Mark as important for teachers');
    });

    it('should set hasTag to true and update tooltip if tag is present', () => {
      component.component.tags = ['!important'];
      fixture.detectChanges();

      expect(component['hasTag']).toBeTrue();
      expect(component['tooltip']).toEqual('Mark as not important for teachers');
    });

    it('should handle undefined tags array', () => {
      component.component.tags = undefined;
      fixture.detectChanges();

      expect(component['hasTag']).toBeFalsy();
      expect(component['tooltip']).toEqual('Mark as important for teachers');
    });
  });

  describe('toggleTag', () => {
    it('should remove tag, set hasTag to false, update tooltip, and save project if tag is present', () => {
      component.component.tags = ['!important', 'other-tag'];
      fixture.detectChanges();

      component['toggleTag']();

      expect(component.component.tags).toEqual(['other-tag']);
      expect(component['hasTag']).toBeFalse();
      expect(component['tooltip']).toEqual('Mark as important for teachers');
      expect(mockProjectService.saveProject).toHaveBeenCalled();
    });

    it('should add tag, set hasTag to true, update tooltip, and save project if tag is not present', () => {
      component.component.tags = ['other-tag'];
      fixture.detectChanges();

      component['toggleTag']();

      expect(component.component.tags).toEqual(['other-tag', '!important']);
      expect(component['hasTag']).toBeTrue();
      expect(component['tooltip']).toEqual('Mark as not important for teachers');
      expect(mockProjectService.saveProject).toHaveBeenCalled();
    });

    it('should create tags array, add tag, set hasTag to true, update tooltip, and save project if tags array is null', () => {
      component.component.tags = undefined;
      fixture.detectChanges();

      component['toggleTag']();

      expect(component.component.tags).toEqual(['!important']);
      expect(component['hasTag']).toBeTrue();
      expect(component['tooltip']).toEqual('Mark as not important for teachers');
      expect(mockProjectService.saveProject).toHaveBeenCalled();
    });
  });
});
