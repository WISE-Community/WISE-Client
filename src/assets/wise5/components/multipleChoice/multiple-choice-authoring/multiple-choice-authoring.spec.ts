import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ProjectService } from '../../../services/projectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { MultipleChoiceAuthoring } from './multiple-choice-authoring.component';
import { MultipleChoiceAuthoringHarness } from './multiple-choice-authoring.harness';

let component: MultipleChoiceAuthoring;
let fixture: ComponentFixture<MultipleChoiceAuthoring>;
let multipleChoiceAuthoringHarness: MultipleChoiceAuthoringHarness;
let projectService: ProjectService;
let teacherProjectService: TeacherProjectService;
describe('MultipleChoiceAuthoringComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MultipleChoiceAuthoring, StudentTeacherCommonServicesModule],
      providers: [
        ProjectAssetService,
        TeacherNodeService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
  }));

  beforeEach(async () => {
    projectService = TestBed.inject(ProjectService);
    teacherProjectService = TestBed.inject(TeacherProjectService);
    const locale = new ProjectLocale({ default: 'en-US' });
    spyOn(teacherProjectService, 'getLocale').and.returnValue(locale);
    spyOn(teacherProjectService, 'isDefaultLocale').and.returnValue(true);
    spyOn(projectService, 'getLocale').and.returnValue(locale);
    projectService.setCurrentLanguage(locale.getDefaultLanguage());
    fixture = TestBed.createComponent(MultipleChoiceAuthoring);
    component = fixture.componentInstance;
    component.componentContent = {
      choices: [],
      choiceType: 'radio',
      prompt: '',
      showFeedback: true,
      type: 'MultipleChoice'
    };
    fixture.detectChanges();
    multipleChoiceAuthoringHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      MultipleChoiceAuthoringHarness
    );
  });

  addChoice();
  deleteChoice();
  changeChoiceType();
  moveChoice();
});

function addChoice() {
  describe('add choice button is clicked', () => {
    it('adds a new choice', async () => {
      await (await multipleChoiceAuthoringHarness.getAddChoiceButton()).click();
      expect(await multipleChoiceAuthoringHarness.getNumChoices()).toBe(1);
    });
  });
}

function deleteChoice() {
  describe('delete choice button is clicked', () => {
    beforeEach(() => {
      component.componentContent.choices = [{ id: 'choice1', text: 'Choice A' }];
    });
    it('deletes a choice', async () => {
      spyOn(window, 'confirm').and.returnValue(true);
      await (await multipleChoiceAuthoringHarness.getDeleteChoiceButton(0)).click();
      expect(await multipleChoiceAuthoringHarness.getNumChoices()).toBe(0);
    });
  });
}

function changeChoiceType() {
  describe('single answer is currently selected', () => {
    describe('multiple answer is clicked', () => {
      it('sets the choice type to checkbox', async () => {
        await (await multipleChoiceAuthoringHarness.getMultipleAnswerRadioChoice()).check();
        expect(component.componentContent.choiceType).toBe('checkbox');
      });
    });
  });
  describe('multiple answer is currently selected', () => {
    describe('single answer is clicked', () => {
      beforeEach(() => {
        component.componentContent.choiceType = 'checkbox';
      });
      it('sets the choice type to radio', async () => {
        await (await multipleChoiceAuthoringHarness.getSingleAnswerRadioChoice()).check();
        expect(component.componentContent.choiceType).toBe('radio');
      });
    });
  });
}

function moveChoice() {
  describe('move choice', () => {
    beforeEach(() => {
      component.componentContent.choices = [
        { id: 'choice1', text: 'Choice A' },
        { id: 'choice2', text: 'Choice B' }
      ];
    });
    describe('move choice down is clicked on the first choice', () => {
      it('moves the choice down', async () => {
        await (await multipleChoiceAuthoringHarness.getMoveChoiceDownButton(0)).click();
        expectChoiceOrder(['choice2', 'choice1']);
      });
    });
    describe('move choice up is clicked on the second choice', () => {
      it('moves the choice up', async () => {
        await (await multipleChoiceAuthoringHarness.getMoveChoiceUpButton(0)).click();
        expectChoiceOrder(['choice2', 'choice1']);
      });
    });
  });
}

function expectChoiceOrder(choiceIds: string[]): void {
  choiceIds.forEach((choiceId, index) => {
    expect(component.componentContent.choices[index].id).toBe(choiceId);
  });
}
