import { Component } from '@angular/core';
import { generateRandomKey } from '../../common/string/string';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'milestones-authoring',
  templateUrl: './milestones-authoring.component.html',
  styleUrls: ['./milestones-authoring.component.scss']
})
export class MilestonesAuthoringComponent {
  availableSatisfyCriteria: any[] = [{ value: 'isCompleted', text: 'Is Completed' }];
  availableSatisfyCriteriaFunctions: any[] = [
    {
      value: 'percentOfScoresLessThan',
      text: $localize`Percent of Scores Less Than`
    },
    {
      value: 'percentOfScoresLessThanOrEqualTo',
      text: $localize`Percent of Scores Less Than or Equal To`
    },
    {
      value: 'percentOfScoresGreaterThan',
      text: $localize`Percent of Scores Greater Than`
    },
    {
      value: 'percentOfScoresGreaterThanOrEqualTo',
      text: $localize`Percent of Scores Greater Than or Equal To`
    },
    {
      value: 'percentOfScoresEqualTo',
      text: $localize`Percent of Scores Equal To`
    }
  ];
  customScoreKey: string;
  customScoreValues: string;
  idToExpanded: any = {};
  milestoneChanged: Subject<void> = new Subject<void>();
  milestoneIdPrefix: string = 'milestone-';
  milestoneIds: any;
  milestoneSatisfyCriteriaIdPrefix: string = 'milestone-satisfy-criteria-';
  milestoneSatisfyCriteriaIds: any;
  nodeItems: any[];
  project: any;
  reportIdPrefix: string = 'report-';
  reportIds: any;
  templateIds: any;
  templateSatisfyCriteriaIds: any;
  templateIdPrefix: string = 'template-';
  templateSatisfyCriteriaIdPrefix: string = 'template-satisfy-criteria-';

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.project = this.projectService.project;
    this.nodeItems = this.getOrderedNodeItems();
    if (this.project.achievements == null) {
      this.initializeMilestones();
    }
    this.milestoneIds = this.getMilestoneIds();
    this.milestoneSatisfyCriteriaIds = this.getMilestoneSatisfyCriteriaIds();
    this.reportIds = this.getReportIds();
    this.templateIds = this.getTemplateIds();
    this.templateSatisfyCriteriaIds = this.getTemplateSatisfyCriteriaIds();
    this.populateIdToExpanded();
    this.milestoneChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.save();
    });
  }

  private getOrderedNodeItems(): any[] {
    return Object.entries(this.projectService.idToOrder)
      .map((entry: any) => {
        return { key: entry[0], order: entry[1].order };
      })
      .filter((nodeItem: any) => {
        return this.projectService.isApplicationNode(nodeItem.key);
      })
      .sort((a: any, b: any) => {
        return a.order - b.order;
      });
  }

  private initializeMilestones(): void {
    this.project.achievements = {
      isEnabled: false,
      items: []
    };
  }

  private populateIdToExpanded(): void {
    for (const milestone of this.project.achievements.items) {
      this.idToExpanded[milestone.id] = false;
      for (const template of milestone.report.templates) {
        this.idToExpanded[template.id] = true;
      }
    }
  }

  protected getNodePositionAndTitle(nodeId: string): string {
    return this.projectService.getNodePositionAndTitle(nodeId);
  }

  protected getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }

  protected isCRaterComponent(component: any): boolean {
    return (
      (component.type === 'OpenResponse' && component.enableCRater) ||
      component.type === 'DialogGuidance'
    );
  }

  protected getItemId(component: any): string {
    if (component.type === 'OpenResponse' && component.enableCRater) {
      return component.cRater.itemId;
    } else if (component.type === 'DialogGuidance') {
      return component.itemId;
    } else {
      return '';
    }
  }

  private createMilestone(): any {
    const item = {
      id: this.generateUniqueId(this.milestoneIdPrefix, this.milestoneIds),
      isEnabled: true,
      type: 'milestoneReport',
      name: '',
      description: '',
      icon: {
        image: ''
      },
      report: this.createReport(),
      satisfyCriteria: [],
      satisfyMinPercentage: 50,
      satisfyMinNumWorkgroups: 2,
      satisfyConditional: 'all'
    };
    return item;
  }

  private getMilestoneIds(): any {
    const milestoneIds = {};
    for (const milestone of this.project.achievements.items) {
      milestoneIds[milestone.id] = true;
    }
    return milestoneIds;
  }

  protected addMilestone(index: number): any {
    const milestone = this.createMilestone();
    this.project.achievements.items.splice(index, 0, milestone);
    this.milestoneIds[milestone.id] = true;
    this.addToIdToExpanded(milestone.id);
    this.save();
    return milestone;
  }

  protected deleteMilestone(index: number): any {
    const message = $localize`Are you sure you want to delete Milestone ${index + 1}?`;
    if (confirm(message)) {
      const deletedMilestones = this.project.achievements.items.splice(index, 1);
      const deletedMilestone = deletedMilestones[0];
      delete this.milestoneIds[deletedMilestone.id];
      this.deleteFromIdToExpanded(deletedMilestone.id);
      this.save();
      return deletedMilestone;
    } else {
      return null;
    }
  }

  private createMilestoneSatisfyCriteria(): any {
    return {
      id: this.generateUniqueId(
        this.milestoneSatisfyCriteriaIdPrefix,
        this.milestoneSatisfyCriteriaIds
      ),
      nodeId: '',
      componentId: '',
      name: ''
    };
  }

  private getMilestoneSatisfyCriteriaIds(): any {
    const milestoneSatisfyCriteriaIds = {};
    for (const milestone of this.project.achievements.items) {
      for (const milestoneSatisfyCriteria of milestone.satisfyCriteria) {
        milestoneSatisfyCriteriaIds[milestoneSatisfyCriteria.id] = true;
      }
    }
    return milestoneSatisfyCriteriaIds;
  }

  protected addMilestoneSatisfyCriteria(milestone: any, index: number): any {
    const milestoneSatisfyCriteria = this.createMilestoneSatisfyCriteria();
    milestone.satisfyCriteria.splice(index, 0, milestoneSatisfyCriteria);
    this.milestoneSatisfyCriteriaIds[milestoneSatisfyCriteria.id] = true;
    this.save();
    return milestoneSatisfyCriteria;
  }

  protected deleteMilestoneSatisfyCriteria(milestone: any, index: number): any {
    const message = $localize`Are you sure you want to delete Milestone Satisfy Criteria ${
      index + 1
    }?`;
    if (confirm(message)) {
      const deletedMilestoneSatisfyCriterias = milestone.satisfyCriteria.splice(index, 1);
      const deletedMilestoneSatisfyCriteria = deletedMilestoneSatisfyCriterias[0];
      delete this.milestoneSatisfyCriteriaIds[deletedMilestoneSatisfyCriteria.id];
      this.save();
      return deletedMilestoneSatisfyCriteria;
    } else {
      return null;
    }
  }

  protected copySatisfyCriteriaToMilestone(
    milestone: any,
    nodeId: string,
    componentId: string
  ): void {
    const message = $localize`Are you sure you want to copy the Node ID and Component ID to the rest of this Milestone?`;
    if (confirm(message)) {
      this.setNodeIdAndComponentIdToAllSatisfyCriteria(milestone, nodeId, componentId);
      this.setNodeIdAndComponentIdToAllLocations(milestone, nodeId, componentId);
      this.save();
    }
  }

  private setNodeIdAndComponentIdToAllSatisfyCriteria(
    milestone: any,
    nodeId: string,
    componentId: string
  ): void {
    for (const template of milestone.report.templates) {
      for (const satisfyCriteria of template.satisfyCriteria) {
        satisfyCriteria.nodeId = nodeId;
        satisfyCriteria.componentId = componentId;
      }
    }
  }

  private setNodeIdAndComponentIdToAllLocations(
    milestone: any,
    nodeId: string,
    componentId: string
  ): void {
    for (const location of milestone.report.locations) {
      location.nodeId = nodeId;
      location.componentId = componentId;
    }
  }

  private createReport(): any {
    const report = {
      id: this.generateUniqueId(this.reportIdPrefix, this.reportIds),
      title: '',
      isEnabled: true,
      audience: ['teacher'],
      templates: [],
      locations: [
        {
          nodeId: '',
          componentId: ''
        }
      ],
      customScoreValues: {}
    };
    return report;
  }

  private getReportIds(): any {
    const reportIds = {};
    for (const milestone of this.project.achievements.items) {
      reportIds[milestone.report.id] = true;
    }
    return reportIds;
  }

  private generateUniqueId(prefix: string, existingIds: any[]): string {
    let id: string;
    do {
      id = prefix + generateRandomKey();
    } while (existingIds[id] != null);
    return id;
  }

  private createLocation(): any {
    return {
      nodeId: '',
      componentId: ''
    };
  }

  protected addLocation(report: any, index: number): any {
    const location = this.createLocation();
    report.locations.splice(index, 0, location);
    this.save();
    return location;
  }

  protected deleteLocation(report: any, index: number): any {
    if (confirm($localize`Are you sure you want to delete this location?`)) {
      const deletedLocations = report.locations.splice(index, 1);
      const deletedLocation = deletedLocations[0];
      this.save();
      return deletedLocation;
    } else {
      return null;
    }
  }

  protected addCustomScoreValues(report: any, key: string, values: string): void {
    if (this.validateCustomScoreValues(key, values)) {
      if (report.customScoreValues == null) {
        report.customScoreValues = {};
      }
      report.customScoreValues[key] = this.getNumberArrayFromCustomScoreValues(values);
      this.customScoreKey = '';
      this.customScoreValues = '';
      this.save();
    }
  }

  private validateCustomScoreValues(key: string, values: string): boolean {
    let errorMessage = '';
    if (key === '') {
      errorMessage += $localize`Error: Key must not be empty` + '\n';
    }
    if (values === '') {
      errorMessage += $localize`Error: Values must not be empty`;
    }
    if (errorMessage === '') {
      return true;
    } else {
      alert(errorMessage);
      return false;
    }
  }

  private getNumberArrayFromCustomScoreValues(valuesString: string): number[] {
    const numberArray = [];
    for (const value of valuesString.split(',')) {
      const numberValue = parseInt(value);
      if (!isNaN(numberValue)) {
        numberArray.push(numberValue);
      }
    }
    return numberArray;
  }

  protected deleteCustomScoreValues(report: any, key: string): void {
    if (confirm($localize`Are you sure you want to delete this custom score value?`)) {
      delete report.customScoreValues[key];
      this.save();
    }
  }

  private createTemplate(): any {
    return {
      id: this.generateUniqueId(this.templateIdPrefix, this.templateIds),
      description: '',
      recommendations: '',
      content: '',
      satisfyConditional: '',
      satisfyCriteria: []
    };
  }

  private getTemplateIds(): any {
    const templateIds = {};
    for (const milestone of this.project.achievements.items) {
      for (const template of milestone.report.templates) {
        templateIds[template.id] = true;
      }
    }
    return templateIds;
  }

  protected addTemplate(report: any, index: number): any {
    const template = this.createTemplate();
    report.templates.splice(index, 0, template);
    this.templateIds[template.id] = true;
    this.addToIdToExpanded(template.id);
    this.save();
    return template;
  }

  protected deleteTemplate(report: any, index: number): any {
    if (confirm($localize`Are you sure you want to delete Template ${index + 1}?`)) {
      const deletedTemplates = report.templates.splice(index, 1);
      const deletedTemplate = deletedTemplates[0];
      delete this.templateIds[deletedTemplate.id];
      this.deleteFromIdToExpanded(deletedTemplate.id);
      this.save();
      return deletedTemplate;
    } else {
      return null;
    }
  }

  private createTemplateSatisfyCriteria(): any {
    return {
      id: this.generateUniqueId(
        this.templateSatisfyCriteriaIdPrefix,
        this.templateSatisfyCriteriaIds
      ),
      nodeId: '',
      componentId: '',
      percentThreshold: 50,
      targetVariable: '',
      function: '',
      type: 'autoScore',
      value: 3
    };
  }

  private getTemplateSatisfyCriteriaIds(): any {
    const templateSatisfyCriteriaIds = {};
    for (const milestone of this.project.achievements.items) {
      for (const template of milestone.report.templates) {
        for (const satisfyCriteria of template.satisfyCriteria) {
          templateSatisfyCriteriaIds[satisfyCriteria.id] = true;
        }
      }
    }
    return templateSatisfyCriteriaIds;
  }

  protected addTemplateSatisfyCriteria(template: any, index: number): any {
    const satisfyCriteria = this.createTemplateSatisfyCriteria();
    template.satisfyCriteria.splice(index, 0, satisfyCriteria);
    this.templateSatisfyCriteriaIds[satisfyCriteria.id] = true;
    this.save();
    return satisfyCriteria;
  }

  protected deleteTemplateSatisfyCriteria(template: any, index: number): any {
    if (
      confirm($localize`Are you sure you want to delete Template Satisfy Criteria ${index + 1}?`)
    ) {
      const deletedSatisfyCriteria = template.satisfyCriteria.splice(index, 1);
      const deletedSatisfyCriterion = deletedSatisfyCriteria[0];
      delete this.templateSatisfyCriteriaIds[deletedSatisfyCriterion.id];
      this.save();
      return deletedSatisfyCriterion;
    } else {
      return null;
    }
  }

  private addToIdToExpanded(id: string): void {
    this.idToExpanded[id] = true;
  }

  private deleteFromIdToExpanded(id: string): void {
    delete this.idToExpanded[id];
  }

  protected expand(id: string): void {
    this.idToExpanded[id] = true;
    this.projectService.uiChanged();
  }

  protected collapse(id: string): void {
    this.idToExpanded[id] = false;
    this.projectService.uiChanged();
  }

  protected save(): void {
    this.projectService.saveProject();
  }

  protected contentChanged(): void {
    this.milestoneChanged.next();
  }
}
