import { AdvancedProjectAuthoringComponent } from './advanced-project-authoring.component';

const USER_ID = 7;

function initialize(metadata: any): AdvancedProjectAuthoringComponent {
  const configService = jasmine.createSpyObj('ConfigService', ['getContextPath', 'getProjectId']);
  configService.getContextPath.and.returnValue('');
  configService.getProjectId.and.returnValue(1);
  const projectService = jasmine.createSpyObj('TeacherProjectService', ['getProjectMetadata']);
  projectService.getProjectMetadata.and.returnValue(metadata);
  projectService.project = { metadata: metadata };
  const userService = jasmine.createSpyObj('UserService', ['getUserId']);
  userService.getUserId.and.returnValue(USER_ID);
  const component = new AdvancedProjectAuthoringComponent(
    configService,
    null,
    projectService,
    userService
  );
  component.ngOnInit();
  return component;
}

describe('AdvancedProjectAuthoringComponent', () => {
  describe('ngOnInit()', () => {
    it('should not treat a unit that has never been saved as the user unit', () => {
      expect(initialize({ title: 'New Unit' })['isMyUnit']).toBeFalse();
    });

    it('should treat a unit the user authored as the user unit', () => {
      expect(initialize({ authors: [{ id: USER_ID }] })['isMyUnit']).toBeTrue();
    });

    it('should not treat a unit someone else authored as the user unit', () => {
      expect(initialize({ authors: [{ id: USER_ID + 1 }] })['isMyUnit']).toBeFalse();
    });
  });
});
