import { MilestoneService } from '../../../assets/wise5/services/milestoneService';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AchievementService } from '../../../assets/wise5/services/achievementService';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { TeacherWebSocketService } from '../../../assets/wise5/services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../assets/wise5/services/classroomStatusService';
import { CopyNodesService } from '../../../assets/wise5/services/copyNodesService';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import satisfyCriterionSample from '../sampleData/sample_satisfyCriterion.json';
import { MilestoneReportService } from '../../../assets/wise5/services/milestoneReportService';
import { createSatisfyCriteria, createScoreCounts } from './milestone-test-functions';
import { copy } from '../../../assets/wise5/common/object/object';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: MilestoneService;
let achievementService: AchievementService;
let configService: ConfigService;
let milestoneReportService: MilestoneReportService;
let projectService: ProjectService;
let teacherDataService: TeacherDataService;

describe('MilestoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [
        ClassroomStatusService,
        CopyNodesService,
        MilestoneService,
        MilestoneReportService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(MilestoneService);
    achievementService = TestBed.inject(AchievementService);
    configService = TestBed.inject(ConfigService);
    milestoneReportService = TestBed.inject(MilestoneReportService);
    projectService = TestBed.inject(ProjectService);
    teacherDataService = TestBed.inject(TeacherDataService);
  });
  getProjectMilestones();
  getMilestoneReportByNodeId();
  getProjectMilestoneStatus();
  insertMilestoneItems();
  insertMilestoneCompletion();
  setWorkgroupsInCurrentPeriod();
  insertMilestoneReport();
  getReferencedComponent();
  isCompletionReached();
  getSatisfyCriteriaReferencedComponents();
});

function getProjectMilestones() {
  describe('getProjectMilestones()', () => {
    it('should get project milestones when it is not enabled', () => {
      spyOn(projectService, 'getAchievements').and.returnValue({ isEnabled: false });
      const milestones = service.getProjectMilestones();
      expect(milestones.length).toEqual(0);
    });
    it('should get project milestones when there are milestones', () => {
      const achievements = {
        isEnabled: true,
        items: [
          {
            type: 'milestone'
          },
          {
            type: 'milestoneReport'
          }
        ]
      };
      spyOn(projectService, 'getAchievements').and.returnValue(achievements);
      const milestones = service.getProjectMilestones();
      expect(milestones.length).toEqual(2);
    });
  });
}

function getMilestoneReportByNodeId() {
  describe('getMilestoneReportByNodeId()', () => {
    it('should get project milestone report by node id when there is none', () => {
      const achievements = {
        isEnabled: true,
        items: [
          {
            id: 'milestone1',
            type: 'milestone',
            report: {
              templates: [
                {
                  satisfyCriteria: [
                    {
                      nodeId: 'node1',
                      componentId: 'component1'
                    }
                  ]
                }
              ]
            }
          }
        ]
      };
      spyOn(projectService, 'getAchievements').and.returnValue(achievements);
      const milestoneReport = service.getMilestoneReportByNodeId('node2');
      expect(milestoneReport).toBeNull();
    });
    it('should get project milestone report by node id when there is one', () => {
      const achievements = {
        isEnabled: true,
        items: [
          {
            id: 'milestone1',
            type: 'milestone',
            report: {
              templates: [
                {
                  satisfyCriteria: [
                    {
                      nodeId: 'node1',
                      componentId: 'component1'
                    }
                  ]
                }
              ]
            }
          }
        ]
      };
      spyOn(projectService, 'getAchievements').and.returnValue(achievements);
      const milestoneReport = service.getMilestoneReportByNodeId('node1');
      expect(milestoneReport).toBeDefined();
    });
  });
}

function getProjectMilestoneStatus() {
  describe('getProjectMilestoneStatus()', () => {
    it('should get project milestone status', () => {
      const milestoneId = 'milestone1';
      const content = 'template1Content';
      const milestone = {
        id: milestoneId,
        report: {
          templates: [
            {
              id: 'template1',
              satisfyConditional: 'any',
              satisfyCriteria: [
                createSatisfyCriteria(
                  'node1',
                  'component1',
                  'ki',
                  'percentOfScoresLessThanOrEqualTo',
                  3,
                  50
                )
              ],
              content: content
            }
          ]
        }
      };
      const achievements = {
        milestone1: [
          createStudentAchievement('milestone1', 1000, 1),
          createStudentAchievement('milestone1', 1000, 2),
          createStudentAchievement('milestone1', 1000, 3),
          createStudentAchievement('milestone1', 1000, 4),
          createStudentAchievement('milestone1', 1000, 5)
        ]
      };
      spyOn(achievementService, 'getAchievementIdToStudentAchievementsMappings').and.returnValue(
        achievements
      );
      spyOn(configService, 'getDisplayUsernamesByWorkgroupId').and.returnValue('student');
      spyOn(teacherDataService, 'getCurrentPeriod').and.returnValue(1);
      spyOn(projectService, 'getAchievementByAchievementId').and.returnValue(milestone);
      const milestoneStatus = service.getProjectMilestoneStatus(milestoneId);
      expect(milestoneStatus.items).toBeDefined();
      expect(milestoneStatus.numberOfStudentsCompleted).toBeDefined();
      expect(milestoneStatus.numberOfStudentsInRun).toBeDefined();
      expect(milestoneStatus.percentageCompleted).toBeDefined();
    });
  });
}

function insertMilestoneItems() {
  describe('insertMilestoneItems()', () => {
    it('should insert milestone items', () => {
      const milestone: any = {
        params: {
          nodeIds: ['node1', 'node2']
        }
      };
      projectService.idToOrder = {
        node1: {},
        node2: {},
        node3: {}
      };
      service.insertMilestoneItems(milestone);
      expect(milestone.items['node1'].checked).toEqual(true);
      expect(milestone.items['node2'].checked).toEqual(true);
      expect(milestone.items['node3'].checked).toBeUndefined();
    });
  });
}

function insertMilestoneCompletion() {
  describe('insertMilestoneCompletion()', () => {
    it('should insert milestone completion', () => {
      const content = 'template1Content';
      const milestone: any = {
        id: 'milestone1',
        report: {
          templates: [
            {
              id: 'template1',
              satisfyConditional: 'any',
              satisfyCriteria: [
                createSatisfyCriteria(
                  'node1',
                  'component1',
                  'ki',
                  'percentOfScoresLessThanOrEqualTo',
                  3,
                  50
                )
              ],
              content: content
            }
          ]
        }
      };
      const achievements = {
        milestone1: [
          createStudentAchievement('milestone1', 1000, 1),
          createStudentAchievement('milestone1', 1000, 2),
          createStudentAchievement('milestone1', 1000, 3),
          createStudentAchievement('milestone1', 1000, 4),
          createStudentAchievement('milestone1', 1000, 5)
        ]
      };
      spyOn(achievementService, 'getAchievementIdToStudentAchievementsMappings').and.returnValue(
        achievements
      );
      spyOn(configService, 'getDisplayUsernamesByWorkgroupId').and.returnValue('student');
      service.workgroupIds = [1, 2, 3, 4, 5];
      service.insertMilestoneCompletion(milestone);
      expect(milestone.numberOfStudentsCompleted).toEqual(5);
    });
  });
}

function createStudentAchievement(
  achievementId: string,
  achievementTime: number,
  workgroupId: number
) {
  return {
    achievementId: achievementId,
    achievementTime: achievementTime,
    workgroupId: workgroupId
  };
}

function insertMilestoneReport() {
  describe('insertMilestoneReport()', () => {
    it('should insert milestone report', () => {
      const content = 'template1Content';
      const milestone: any = {
        report: {
          locations: [
            {
              nodeId: 'node1',
              componentId: 'component1'
            }
          ],
          templates: [
            {
              id: 'template1',
              satisfyConditional: 'any',
              satisfyCriteria: [
                createSatisfyCriteria(
                  'node1',
                  'component1',
                  'ki',
                  'percentOfScoresLessThanOrEqualTo',
                  3,
                  50
                )
              ],
              content: content
            }
          ]
        },
        percentageCompleted: 60,
        satisfyMinPercentage: 50,
        numberOfStudentsCompleted: 4,
        satisfyMinNumWorkgroups: 2
      };
      const aggregateAutoScores = {
        ki: {
          counts: createScoreCounts([10, 10, 10, 10, 10]),
          scoreCount: 50
        }
      };
      spyOn(milestoneReportService, 'calculateAggregateAutoScores').and.returnValue(
        aggregateAutoScores
      );
      service.insertMilestoneReport(milestone);
      expect(milestone.isReportAvailable).toEqual(true);
      expect(milestone.generatedReport).toEqual(content);
    });
  });
}

function setWorkgroupsInCurrentPeriod() {
  describe('setWorkgroupsInCurrentPeriod()', () => {
    it('should set workgroups in current period', () => {
      spyOn(configService, 'getClassmateWorkgroupIds').and.returnValue([1, 2, 3]);
      spyOn(configService, 'getPeriodIdByWorkgroupId').and.returnValue(1);
      service.periodId = 1;
      service.setWorkgroupsInCurrentPeriod();
      expect(service.numberOfStudentsInRun).toEqual(3);
      expect(service.workgroupIds[0]).toEqual(1);
      expect(service.workgroupIds[1]).toEqual(2);
      expect(service.workgroupIds[2]).toEqual(3);
    });
  });
}

function getReferencedComponent() {
  describe('getReferencedComponent()', () => {
    it('should get referenced component', () => {
      const milestone = {
        report: {
          templates: [
            {
              satisfyCriteria: [
                createSatisfyCriteria('node1', 'component1'),
                createSatisfyCriteria('node2', 'component2')
              ]
            },
            {
              satisfyCriteria: [
                createSatisfyCriteria('node1', 'component1'),
                createSatisfyCriteria('node3', 'component3')
              ]
            }
          ]
        }
      };
      const referencedComponent = service.getReferencedComponent(milestone);
      expect(referencedComponent).toEqual({ nodeId: 'node3', componentId: 'component3' });
    });
  });
}

function isCompletionReached() {
  describe('isCompletionReached()', () => {
    function expectIsCompletionReached(
      percentageCompleted,
      satisfyMinPercentage,
      numberOfStudentsCompleted,
      satisfyMinNumWorkgroups,
      expectedResult
    ) {
      expect(
        service.isCompletionReached({
          percentageCompleted: percentageCompleted,
          satisfyMinPercentage: satisfyMinPercentage,
          numberOfStudentsCompleted: numberOfStudentsCompleted,
          satisfyMinNumWorkgroups: satisfyMinNumWorkgroups
        })
      ).toEqual(expectedResult);
    }
    it('should check is completion reached percent false and num students false', () => {
      expectIsCompletionReached(25, 50, 2, 4, false);
    });
    it('should check is completion reached percent true and num students false', () => {
      expectIsCompletionReached(60, 50, 2, 4, false);
    });
    it('should check is completion reached percent false and num students false', () => {
      expectIsCompletionReached(25, 50, 6, 4, false);
    });
    it('should check is completion reached perecent true and num students true', () => {
      expectIsCompletionReached(60, 50, 6, 4, true);
    });
  });
}

function getSatisfyCriteriaReferencedComponents() {
  describe('getSatisfyCriteriaReferencedComponents()', () => {
    it('should return referenced components', () => {
      const satisfyCriterion = copy(satisfyCriterionSample);
      satisfyCriterion.nodeId = 'node2';
      const projectAchievement = {
        report: {
          templates: [
            {
              satisfyCriteria: [satisfyCriterionSample, satisfyCriterion]
            }
          ]
        }
      };
      expect(service.getSatisfyCriteriaReferencedComponents(projectAchievement)).toEqual({
        node1_xfns1g7pga: {
          nodeId: 'node1',
          componentId: 'xfns1g7pga'
        },
        node2_xfns1g7pga: {
          nodeId: 'node2',
          componentId: 'xfns1g7pga'
        }
      });
    });
  });
}
