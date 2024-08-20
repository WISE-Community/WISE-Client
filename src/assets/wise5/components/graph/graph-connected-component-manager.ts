import { GraphService } from './graphService';
import { ProjectService } from '../../services/projectService';
import { generateRandomKey } from '../../common/string/string';
import { copy } from '../../common/object/object';

export class GraphConnectedComponentManager {
  constructor(
    private graphService: GraphService,
    private projectService: ProjectService
  ) {}

  /**
   * Get the trials from classmates
   * @param nodeId the node id
   * @param componentId the component id
   * @param showClassmateWorkSource Whether to get the work only from the
   * period the student is in or from all the periods. The possible values
   * are "period" or "class".
   * @return a promise that will return all the trials from the classmates
   */
  getTrialsFromClassmates(
    nodeId: string,
    componentId: string,
    periodId: number,
    showWorkNodeId: string,
    showWorkComponentId: string,
    showClassmateWorkSource: 'period' | 'class'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.graphService
        .getClassmateStudentWork(
          nodeId,
          componentId,
          periodId,
          showWorkNodeId,
          showWorkComponentId,
          showClassmateWorkSource
        )
        .subscribe((componentStates: any[]) => {
          const promises = [];
          for (const componentState of componentStates) {
            promises.push(this.getTrialsFromComponentState(nodeId, componentId, componentState));
          }
          Promise.all(promises).then((promiseResults) => {
            const mergedTrials = [];
            for (const trials of promiseResults) {
              for (const trial of trials) {
                mergedTrials.push(trial);
              }
            }
            resolve(mergedTrials);
          });
        });
    });
  }

  /**
   * Get the trials from a component state.
   * Note: The code in this function doesn't actually require usage of a
   * promise. It's just the code that calls this function that utilizes
   * promise functionality. It's possible to refactor the code so that this
   * function doesn't need to return a promise.
   * @param nodeId the node id
   * @param componentId the component id
   * @param componentState the component state
   * @return a promise that will return the trials from the component state
   */
  getTrialsFromComponentState(
    nodeId: string,
    componentId: string,
    componentState: any
  ): Promise<any> {
    const mergedTrials = [];
    const nodePositionAndTitle = this.projectService.getNodePositionAndTitle(nodeId);
    const studentData = componentState.studentData;
    if (studentData.version == null || studentData.version === 1) {
      const series = studentData.series;
      const newTrial = {
        id: generateRandomKey(),
        name: nodePositionAndTitle,
        show: true,
        series: series
      };
      mergedTrials.push(newTrial);
    } else {
      const trials = studentData.trials;
      if (trials != null) {
        for (const trial of trials) {
          const newTrial = copy(trial);
          newTrial.name = nodePositionAndTitle;
          newTrial.show = true;
          mergedTrials.push(newTrial);
        }
      }
    }
    return Promise.resolve(mergedTrials);
  }
}
