'use strict';

import { Injectable } from '@angular/core';
import { ProjectService } from './projectService';
import { ConfigService } from './configService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { isMatchingPeriods } from '../common/period/period';
import { generateRandomKey } from '../common/string/string';
import { Annotation } from '../common/Annotation';

@Injectable()
export class AnnotationService {
  annotations: Annotation[] = [];
  dummyAnnotationId: number = 1; // used in preview mode when we simulate saving of annotation
  private annotationSavedToServerSource: Subject<Annotation> = new Subject<Annotation>();
  public annotationSavedToServer$: Observable<Annotation> = this.annotationSavedToServerSource.asObservable();
  private annotationReceivedSource: Subject<Annotation> = new Subject<Annotation>();
  public annotationReceived$: Observable<Annotation> = this.annotationReceivedSource.asObservable();

  constructor(
    private http: HttpClient,
    private ConfigService: ConfigService,
    private ProjectService: ProjectService
  ) {}

  getAnnotations(): Annotation[] {
    return this.annotations;
  }

  getAnnotationById(annotationId: number): Annotation {
    return this.annotations.find((annotation) => annotation.id === annotationId) || null;
  }

  /**
   * Get the latest annotation with the given params
   * @param params an object containing the params to match
   * @returns the latest annotation that matches the params
   */
  getLatestAnnotation(params) {
    let annotation = null;

    if (params != null) {
      let nodeId = params.nodeId;
      let componentId = params.componentId;
      let fromWorkgroupId = params.fromWorkgroupId;
      let toWorkgroupId = params.toWorkgroupId;
      let type = params.type;

      let annotations = this.annotations;

      if (annotations != null) {
        for (let a = annotations.length - 1; a >= 0; a--) {
          let tempAnnotation = annotations[a];

          if (tempAnnotation != null) {
            let match = true;

            if (nodeId && tempAnnotation.nodeId !== nodeId) {
              match = false;
            }
            if (match && componentId && tempAnnotation.componentId !== componentId) {
              match = false;
            }
            if (match && fromWorkgroupId && tempAnnotation.fromWorkgroupId !== fromWorkgroupId) {
              match = false;
            }
            if (match && toWorkgroupId && tempAnnotation.toWorkgroupId !== toWorkgroupId) {
              match = false;
            }
            if (match && type) {
              if (type.constructor === Array) {
                for (let thisType of type) {
                  if (tempAnnotation.type !== thisType) {
                    match = false;
                  }
                }
              } else {
                if (tempAnnotation.type !== type) {
                  match = false;
                }
              }
            }

            if (match) {
              annotation = tempAnnotation;
              break;
            }
          }
        }
      }
    }
    return annotation;
  }

  /**
   * Create an annotation object
   * @param annotationId the annotation id
   * @param runId the run id
   * @param periodId the period id
   * @param fromWorkgroupId the from workgroup id
   * @param toWorkgroupId the to workgroup id
   * @param nodeId the node id
   * @param componentId the component id
   * @param studentWorkId the student work id
   * @param annotationType the annotation type
   * @param data the data
   * @param clientSaveTime the client save time
   * @returns an annotation object
   */
  createAnnotation(
    annotationId,
    runId,
    periodId,
    fromWorkgroupId,
    toWorkgroupId,
    nodeId,
    componentId,
    studentWorkId,
    localNotebookItemId,
    notebookItemId,
    annotationType,
    data,
    clientSaveTime
  ) {
    return {
      id: annotationId,
      runId: runId,
      periodId: periodId,
      fromWorkgroupId: fromWorkgroupId,
      toWorkgroupId: toWorkgroupId,
      nodeId: nodeId,
      componentId: componentId,
      studentWorkId: studentWorkId,
      localNotebookItemId: localNotebookItemId,
      notebookItemId: notebookItemId,
      type: annotationType,
      data: data,
      clientSaveTime: clientSaveTime
    };
  }

  /**
   * Save the annotation to the server
   * @param annotation the annotation object
   * @returns a promise
   */
  saveAnnotation(annotation) {
    annotation.requestToken = generateRandomKey(); // use this to keep track of unsaved annotations.
    this.addOrUpdateAnnotation(annotation);
    const annotations = [annotation];
    if (this.ConfigService.isPreview()) {
      // if we're in preview, don't make any request to the server but pretend we did
      let savedAnnotationDataResponse = {
        annotations: annotations
      };
      let annotation = this.saveToServerSuccess(savedAnnotationDataResponse);
      return Promise.resolve(annotation);
    } else {
      const params = {
        runId: this.ConfigService.getRunId(),
        workgroupId: this.ConfigService.getWorkgroupId(),
        annotations: JSON.stringify(annotations)
      };
      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      return this.http
        .post(this.ConfigService.getConfigParam('teacherDataURL'), $.param(params), {
          headers: headers
        })
        .toPromise()
        .then((savedAnnotationDataResponse: any) => {
          return this.saveToServerSuccess(savedAnnotationDataResponse);
        });
    }
  }

  saveToServerSuccess(savedAnnotationDataResponse) {
    let localAnnotation = null;
    if (savedAnnotationDataResponse != null) {
      let savedAnnotations = savedAnnotationDataResponse.annotations;
      let localAnnotations = this.annotations;
      if (savedAnnotations != null && localAnnotations != null) {
        for (let savedAnnotation of savedAnnotations) {
          for (let y = localAnnotations.length - 1; y >= 0; y--) {
            localAnnotation = localAnnotations[y];

            if (localAnnotation.id != null && localAnnotation.id === savedAnnotation.id) {
              // we have found the matching local annotation so we will update it
              localAnnotation.serverSaveTime = savedAnnotation.serverSaveTime;
              //localAnnotation.requestToken = null; // requestToken is no longer needed.

              this.broadcastAnnotationSavedToServer(localAnnotation);
              break;
            } else if (
              localAnnotation.requestToken != null &&
              localAnnotation.requestToken === savedAnnotation.requestToken
            ) {
              // we have found the matching local annotation so we will update it
              localAnnotation.id = savedAnnotation.id;
              localAnnotation.serverSaveTime = savedAnnotation.serverSaveTime;
              localAnnotation.requestToken = null; // requestToken is no longer needed.

              if (this.ConfigService.isPreview() && localAnnotation.id == null) {
                /*
                 * we are in preview mode so we will set a dummy
                 * annotation id into the annotation
                 */
                localAnnotation.id = this.dummyAnnotationId;
                /*
                 * increment the dummy annotation id for the next
                 * annotation
                 */
                this.dummyAnnotationId++;
              }

              this.broadcastAnnotationSavedToServer(localAnnotation);
              break;
            }
          }
        }
      }
    }
    return localAnnotation;
  }

  addOrUpdateAnnotation(annotation) {
    let isAnnotationFound = false;
    for (let a = this.annotations.length - 1; a >= 0; a--) {
      const localAnnotation = this.annotations[a];
      if (this.isAnnotationMatch(annotation, localAnnotation)) {
        isAnnotationFound = true;
        localAnnotation.data = annotation.data;
        localAnnotation.clientSaveTime = annotation.clientSaveTime;
        localAnnotation.serverSaveTime = annotation.serverSaveTime;
      }
    }
    if (!isAnnotationFound) {
      this.annotations.push(annotation);
    }
  }

  isAnnotationMatch(annotation1, annotation2) {
    return (
      annotation1.id === annotation2.id &&
      annotation1.nodeId === annotation2.nodeId &&
      annotation1.componentId === annotation2.componentId &&
      annotation1.fromWorkgroupId === annotation2.fromWorkgroupId &&
      annotation1.toWorkgroupId === annotation2.toWorkgroupId &&
      annotation1.type === annotation2.type &&
      annotation1.studentWorkId === annotation2.studentWorkId &&
      annotation1.runId === annotation2.runId &&
      annotation1.periodId === annotation2.periodId
    );
  }

  /**
   * Set the annotations
   * @param annotations the annotations aray
   */
  setAnnotations(annotations) {
    this.annotations = annotations;
  }

  getTotalScore(annotations = []) {
    let totalScore: number = null;
    const scoresFound = []; // to prevent double counting if teacher scored component multiple times
    const scoreAnnotations = this.getScoreAnnotations(annotations);
    for (let i = scoreAnnotations.length - 1; i >= 0; i--) {
      const annotation = scoreAnnotations[i];
      const component = `${annotation.nodeId}-${annotation.componentId}`;
      if (!scoresFound.includes(component)) {
        totalScore += annotation.data.value;
        scoresFound.push(component);
      }
    }
    return totalScore;
  }

  getScoreAnnotations(annotations = []) {
    return annotations.filter((annotation) => {
      return (
        this.isScoreOrAutoScore(annotation) &&
        this.ProjectService.shouldIncludeInTotalScore(annotation.nodeId, annotation.componentId)
      );
    });
  }

  isScoreOrAutoScore(annotation: any): boolean {
    return annotation.type === 'score' || annotation.type === 'autoScore';
  }

  getTotalNodeScoreForWorkgroup(workgroupId: number, nodeId: string) {
    const annotationsForNodeAndWorkgroup = this.annotations.filter((annotation) => {
      return annotation.nodeId === nodeId && annotation.toWorkgroupId === workgroupId;
    });
    return this.getTotalScore(annotationsForNodeAndWorkgroup);
  }

  /**
   * Create an auto score annotation
   * @param runId the run id
   * @param periodId the period id
   * @param nodeId the node id
   * @param componentId the component id
   * @param toWorkgroupId the student workgroup id
   * @param data the annotation data
   * @returns the auto score annotation
   */
  createAutoScoreAnnotation(runId, periodId, nodeId, componentId, toWorkgroupId, data) {
    const annotationId = null;
    const fromWorkgroupId = null;
    const studentWorkId = null;
    const localNotebookItemId = null;
    const notebookItemId = null;
    const annotationType = 'autoScore';
    const clientSaveTime = Date.parse(new Date().toString());
    const annotation = this.createAnnotation(
      annotationId,
      runId,
      periodId,
      fromWorkgroupId,
      toWorkgroupId,
      nodeId,
      componentId,
      studentWorkId,
      localNotebookItemId,
      notebookItemId,
      annotationType,
      data,
      clientSaveTime
    );
    return annotation;
  }

  /**
   * Create an auto comment annotation
   * @param runId the run id
   * @param periodId the period id
   * @param nodeId the node id
   * @param componentId the component id
   * @param toWorkgroupId the student workgroup id
   * @param data the annotation data
   * @returns the auto comment annotation
   */
  createAutoCommentAnnotation(runId, periodId, nodeId, componentId, toWorkgroupId, data) {
    const annotationId = null;
    const fromWorkgroupId = null;
    const studentWorkId = null;
    const localNotebookItemId = null;
    const notebookItemId = null;
    const annotationType = 'autoComment';
    const clientSaveTime = Date.parse(new Date().toString());
    const annotation = this.createAnnotation(
      annotationId,
      runId,
      periodId,
      fromWorkgroupId,
      toWorkgroupId,
      nodeId,
      componentId,
      studentWorkId,
      localNotebookItemId,
      notebookItemId,
      annotationType,
      data,
      clientSaveTime
    );
    return annotation;
  }

  /**
   * Create an auto comment annotation
   * @param runId the run id
   * @param periodId the period id
   * @param nodeId the node id
   * @param componentId the component id
   * @param fromWorkgroupId the teacher workgroup id
   * @param toWorkgroupId the student workgroup id
   * @param studentWorkId the component state id
   * @param data the annotation data
   * @returns the inappropriate flag annotation
   */
  createInappropriateFlagAnnotation(
    runId,
    periodId,
    nodeId,
    componentId,
    fromWorkgroupId,
    toWorkgroupId,
    studentWorkId,
    data
  ) {
    const annotationId = null;
    const localNotebookItemId = null;
    const notebookItemId = null;
    const annotationType = 'inappropriateFlag';
    const clientSaveTime = Date.parse(new Date().toString());
    const annotation = this.createAnnotation(
      annotationId,
      runId,
      periodId,
      fromWorkgroupId,
      toWorkgroupId,
      nodeId,
      componentId,
      studentWorkId,
      localNotebookItemId,
      notebookItemId,
      annotationType,
      data,
      clientSaveTime
    );
    return annotation;
  }

  /**
   * Get the latest annotations for a given component (as an object)
   * @param nodeId the node id
   * @param componentId the component id
   * @param workgroupId the workgroup id
   * @param scoreType (optional) the type of score
   * e.g.
   * 'autoScore' for auto graded score
   * 'score' for teacher graded score
   * 'any' for auto graded score or teacher graded score
   * @param commentType (optional) the type of comment
   * e.g.
   * 'autoComment' for auto graded comment
   * 'comment' for teacher graded comment
   * 'any' for auto graded comment or teacher graded comment
   * @return object containing the component's latest score and comment annotations
   */
  getLatestComponentAnnotations(
    nodeId: string,
    componentId: string,
    workgroupId: number,
    scoreType: 'score' | 'autoScore' | 'any' = 'any',
    commentType: 'comment' | 'autoComment' | 'any' = 'any'
  ): any {
    return {
      score: this.getLatestScoreAnnotation(nodeId, componentId, workgroupId, scoreType),
      comment: this.getLatestCommentAnnotation(nodeId, componentId, workgroupId, commentType)
    };
  }

  /**
   * Get the latest annotations for a given notebook item (as an object)
   * @param workgroupId the workgroup id that did the notebook
   * @param localNotebookItemId unique id for note and its revisions ["finalReport", "xyzabc", ...]
   */
  getLatestNotebookItemAnnotations(workgroupId, localNotebookItemId) {
    let latestScoreAnnotation = null;
    let latestCommentAnnotation = null;
    latestScoreAnnotation = this.getLatestNotebookItemScoreAnnotation(
      workgroupId,
      localNotebookItemId
    );
    latestCommentAnnotation = this.getLatestNotebookItemCommentAnnotation(
      workgroupId,
      localNotebookItemId
    );

    return {
      score: latestScoreAnnotation,
      comment: latestCommentAnnotation
    };
  }

  /**
   * Get the latest score annotation for this workgroup and localNotebookItemId, or null if not found
   * @param workgroupId the workgroup id that did the notebook
   * @param localNotebookItemId unique id for note and its revisions ["finalReport", "xyzabc", ...]
   */
  getLatestNotebookItemScoreAnnotation(workgroupId, localNotebookItemId) {
    let annotations = this.getAnnotations();
    for (let a = annotations.length - 1; a >= 0; a--) {
      let annotation = annotations[a];
      if (
        annotation != null &&
        annotation.type === 'score' &&
        annotation.notebookItemId != null &&
        annotation.localNotebookItemId === localNotebookItemId
      ) {
        return annotation;
      }
    }
    return null;
  }

  /**
   * Get the latest comment annotation for this workgroup and localNotebookItemId, or null if not found
   * @param workgroupId the workgroup id that did the notebook
   * @param localNotebookItemId unique id for note and its revisions ["finalReport", "xyzabc", ...]
   */
  getLatestNotebookItemCommentAnnotation(workgroupId, localNotebookItemId) {
    let annotations = this.getAnnotations();
    for (let a = annotations.length - 1; a >= 0; a--) {
      let annotation = annotations[a];
      if (
        annotation != null &&
        annotation.type === 'comment' &&
        annotation.notebookItemId != null &&
        annotation.localNotebookItemId === localNotebookItemId
      ) {
        return annotation;
      }
    }
    return null;
  }

  getLatestScoreAnnotation(
    nodeId: string,
    componentId: string,
    workgroupId: number,
    scoreType: 'score' | 'autoScore' | 'any' = 'any'
  ): Annotation {
    return (
      this.getAnnotations()
        .filter(
          (annotation) =>
            annotation.nodeId == nodeId &&
            annotation.componentId == componentId &&
            annotation.toWorkgroupId == workgroupId &&
            this.matchesScoreType(annotation, scoreType)
        )
        .at(-1) || null
    );
  }

  private matchesScoreType(
    annotation: Annotation,
    scoreType: 'score' | 'autoScore' | 'any'
  ): boolean {
    return (
      (scoreType === 'any' && ['autoScore', 'score'].includes(annotation.type)) ||
      annotation.type === scoreType
    );
  }

  isThereAnyScoreAnnotation(nodeId, componentId, periodId) {
    const annotations = this.getAnnotations();
    for (const annotation of annotations) {
      if (
        annotation.nodeId === nodeId &&
        annotation.componentId === componentId &&
        isMatchingPeriods(annotation.periodId, periodId) &&
        this.isScoreOrAutoScore(annotation)
      ) {
        return true;
      }
    }
    return false;
  }

  getLatestCommentAnnotation(
    nodeId: string,
    componentId: string,
    workgroupId: number,
    commentType: 'comment' | 'autoComment' | 'any' = 'any'
  ): Annotation {
    return (
      this.getAnnotations()
        .filter(
          (annotation) =>
            annotation.nodeId == nodeId &&
            annotation.componentId == componentId &&
            annotation.toWorkgroupId == workgroupId &&
            this.matchesCommentType(annotation, commentType)
        )
        .at(-1) || null
    );
  }

  private matchesCommentType(
    annotation: Annotation,
    commentType: 'comment' | 'autoComment' | 'any'
  ): boolean {
    return (
      (commentType === 'any' && ['autoComment', 'comment'].includes(annotation.type)) ||
      annotation.type === commentType
    );
  }

  getScoreValueFromScoreAnnotation(scoreAnnotation: any): number {
    return scoreAnnotation.data.value;
  }

  getSubScoreValueFromScoreAnnotation(scoreAnnotation: any, scoreId: string = ''): number {
    for (const scoreObject of scoreAnnotation.data.scores) {
      if (scoreObject.id === scoreId) {
        return scoreObject.score;
      }
    }
    return null;
  }

  /**
   * Get the latest teacher score annotation for a student work id
   * @param studentWorkId the student work id
   * @return the latest teacher score annotation for the student work
   */
  getLatestTeacherScoreAnnotationByStudentWorkId(studentWorkId) {
    return this.getLatestAnnotationByStudentWorkIdAndType(studentWorkId, 'score');
  }

  /**
   * Get the latest teacher comment annotation for a student work id
   * @param studentWorkId the student work id
   * @return the latest teacher comment annotation for the student work
   */
  getLatestTeacherCommentAnnotationByStudentWorkId(studentWorkId) {
    return this.getLatestAnnotationByStudentWorkIdAndType(studentWorkId, 'comment');
  }

  /**
   * Get the latest auto score annotation for a student work id
   * @param studentWorkId the student work id
   * @return the latest auto score annotation for the student work
   */
  getLatestAutoScoreAnnotationByStudentWorkId(studentWorkId) {
    return this.getLatestAnnotationByStudentWorkIdAndType(studentWorkId, 'autoScore');
  }

  /**
   * Get the latest auto comment annotation for a student work id
   * @param studentWorkId the student work id
   * @return the latest auto comment annotation for the student work
   */
  getLatestAutoCommentAnnotationByStudentWorkId(studentWorkId) {
    return this.getLatestAnnotationByStudentWorkIdAndType(studentWorkId, 'autoComment');
  }

  /**
   * Get the latest annotation for the given student work and annotation type
   * @param studentWorkId the student work id
   * @param type the type of annotation
   * @return the latest annotation for the given student work and annotation type
   */
  getLatestAnnotationByStudentWorkIdAndType(studentWorkId: number, type: string): Annotation {
    return (
      this.annotations
        .filter(
          (annotation) => annotation.studentWorkId === studentWorkId && annotation.type === type
        )
        .at(-1) || null
    );
  }

  /**
   * Get the annotations for the given student work
   * @param studentWorkId the student work id
   * @return array of annotations for the given student work
   */
  getAnnotationsByStudentWorkId(studentWorkId: number): Annotation[] {
    return this.annotations.filter((annotation) => annotation.studentWorkId === studentWorkId);
  }

  getAllLatestScoreAnnotations(nodeId, componentId, periodId) {
    const workgroupIdsFound = {};
    const latestScoreAnnotations = [];
    for (let a = this.annotations.length - 1; a >= 0; a--) {
      const annotation = this.annotations[a];
      const workgroupId = annotation.toWorkgroupId;
      if (
        workgroupIdsFound[workgroupId] == null &&
        nodeId === annotation.nodeId &&
        componentId === annotation.componentId &&
        (periodId === -1 || periodId === annotation.periodId) &&
        ('score' === annotation.type || 'autoScore' === annotation.type)
      ) {
        workgroupIdsFound[workgroupId] = annotation;
        latestScoreAnnotations.push(annotation);
      }
    }
    return latestScoreAnnotations;
  }

  broadcastAnnotationSavedToServer(annotation: Annotation): void {
    this.annotationSavedToServerSource.next(annotation);
  }

  broadcastAnnotationReceived(annotation: Annotation): void {
    this.annotationReceivedSource.next(annotation);
  }
}
