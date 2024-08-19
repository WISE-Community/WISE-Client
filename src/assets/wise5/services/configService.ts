'use strict';

import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { formatDate } from '@angular/common';
import { isMatchingPeriods } from '../common/period/period';
import { millisecondsToDateTime } from '../common/datetime/datetime';
import { usernameComparator } from '../common/user/user';

@Injectable()
export class ConfigService {
  public config: any = null;
  private configRetrievedSource: Subject<any> = new Subject<any>();
  public configRetrieved$: Observable<any> = this.configRetrievedSource.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private localeID: string
  ) {}

  setConfig(config) {
    this.config = config;
    this.sortClassmateUserInfosAlphabeticallyByName();
    this.setClassmateDisplayNames();
  }

  retrieveConfig(configURL: string) {
    return this.http.get(configURL).pipe(
      tap((configJSON: any) => {
        this.setTimestampDiff(configJSON);

        let constraints = true;

        const absURL = document.location.href;

        if (configJSON.mode === 'preview') {
          // constraints can only be disabled using the url in preview mode

          // regex to match constraints=false in the url
          const constraintsRegEx = new RegExp('constraints=false', 'gi');

          if (absURL != null && absURL.match(constraintsRegEx)) {
            // the url contains constraints=false
            constraints = false;
          }
        }

        // set the constraints value into the config so we can access it later
        configJSON.constraints = constraints;

        // regex to match showProjectPath=true in the url
        const showProjectPathRegEx = new RegExp('showProjectPath=true', 'gi');

        if (absURL != null && absURL.match(showProjectPathRegEx)) {
          // the url contains showProjectPath=true
          const host = location.origin;
          const projectURL = configJSON.projectURL;
          const projectPath = host + projectURL;
          console.log(projectPath);
        }

        configJSON.isRunActive = this.calculateIsRunActive(configJSON);

        this.setConfig(configJSON);

        if (this.isPreview()) {
          const myUserInfo = this.getMyUserInfo();
          if (myUserInfo != null) {
            // set the workgroup id to a random integer between 1 and 100
            myUserInfo.workgroupId = Math.floor(100 * Math.random()) + 1;
          }
        }
        this.configRetrievedSource.next(configJSON);
        return configJSON;
      })
    );
  }

  setTimestampDiff(configJSON) {
    if (configJSON.retrievalTimestamp != null) {
      const clientTimestamp = new Date().getTime();
      const serverTimestamp = configJSON.retrievalTimestamp;
      const timestampDiff = clientTimestamp - serverTimestamp;
      configJSON.timestampDiff = timestampDiff;
    } else {
      configJSON.timestampDiff = 0;
    }
  }

  getConfigParam(paramName) {
    if (this.config != null) {
      return this.config[paramName];
    } else {
      return null;
    }
  }

  getAchievementsURL() {
    return this.getConfigParam('achievementURL');
  }

  getCRaterRequestURL() {
    return this.getConfigParam('cRaterRequestURL');
  }

  getMainHomePageURL() {
    return this.getConfigParam('mainHomePageURL');
  }

  getNotificationURL() {
    return this.getConfigParam('notificationURL');
  }

  getRunId() {
    return this.getConfigParam('runId');
  }

  getRunCode() {
    return this.getConfigParam('runCode');
  }

  getRunName() {
    return this.getConfigParam('runName');
  }

  getProjectId() {
    return this.getConfigParam('projectId');
  }

  getSessionLogOutURL() {
    return this.getConfigParam('sessionLogOutURL');
  }

  getStudentAssetsURL() {
    return this.getConfigParam('studentAssetsURL');
  }

  getStudentStatusURL() {
    return this.getConfigParam('studentStatusURL');
  }

  getStudentMaxTotalAssetsSize() {
    return this.getConfigParam('studentMaxTotalAssetsSize');
  }

  getNotebookURL() {
    return this.getConfigParam('notebookURL');
  }

  getStudentUploadsBaseURL() {
    return this.getConfigParam('studentUploadsBaseURL');
  }

  getUserInfo() {
    return this.getConfigParam('userInfo');
  }

  getWebSocketURL() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${this.getContextPath()}/websocket`;
  }

  getWISEBaseURL() {
    return this.getConfigParam('wiseBaseURL');
  }

  getLocale() {
    return this.getConfigParam('locale') || 'en';
  }

  getMode() {
    return this.getConfigParam('mode');
  }

  getContextPath() {
    return this.getConfigParam('contextPath');
  }

  getPeriodId() {
    const myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      return myUserInfo.periodId;
    }
    return null;
  }

  getPeriods(): any[] {
    const myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      const myClassInfo = myUserInfo.myClassInfo;
      if (myClassInfo != null) {
        if (myClassInfo.periods != null) {
          return myClassInfo.periods;
        }
      }
    }
    return [];
  }

  getWorkgroupId() {
    const myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      return myUserInfo.workgroupId;
    }
    return null;
  }

  getUserId() {
    const myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      return myUserInfo.id;
    }
    return null;
  }

  getMyUserInfo() {
    const userInfo = this.getUserInfo();
    if (userInfo != null) {
      return userInfo.myUserInfo;
    }
    return null;
  }

  getMyUsername() {
    const myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      return myUserInfo.username;
    }
    return null;
  }

  getClassmateUserInfos() {
    const myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      const myClassInfo = myUserInfo.myClassInfo;
      if (myClassInfo != null) {
        return myClassInfo.classmateUserInfos;
      }
    }
    return null;
  }

  setClassmateDisplayNames() {
    let classmateUserInfos = this.getClassmateUserInfos();
    if (classmateUserInfos) {
      for (let workgroup of classmateUserInfos) {
        workgroup.displayNames = this.getDisplayUsernamesByWorkgroupId(workgroup.workgroupId);
      }
    }
  }

  /**
   * Get the classmate user infos sorted by ascending workgroup id
   * @return an array of classmate user info objects sorted by ascending
   * workgroup id
   */
  getClassmateUserInfosSortedByWorkgroupId() {
    const sortedClassmateUserInfos = [];
    const classmateUserInfos = this.getClassmateUserInfos();
    if (classmateUserInfos != null) {
      for (let classmateUserInfo of classmateUserInfos) {
        sortedClassmateUserInfos.push(classmateUserInfo);
      }
    }
    // sort the new classmate user infos array by ascending workgroup id
    sortedClassmateUserInfos.sort(this.compareClassmateUserInfosByWorkgroupId);
    return sortedClassmateUserInfos;
  }

  /**
   * Used to sort the classmate user infos by ascending workgroup id.
   * Use by calling myArray.sort(compareClassmateUserInfosByWorkgroupId)
   * @param a a user info object
   * @param b a user info Object
   * @return -1 if a comes before b
   * 1 if a comes after b
   * 0 if a equals b
   */
  compareClassmateUserInfosByWorkgroupId(a, b) {
    if (a.workgroupId < b.workgroupId) {
      return -1;
    } else if (a.workgroupId > b.workgroupId) {
      return 1;
    } else {
      return 0;
    }
  }

  getTeacherWorkgroupIds(): number[] {
    const teacherWorkgroupIds = [];
    const teacherWorkgroupId = this.getTeacherWorkgroupId();
    if (teacherWorkgroupId != null) {
      teacherWorkgroupIds.push(teacherWorkgroupId);
    }
    teacherWorkgroupIds.push(...this.getSharedTeacherWorkgroupIds());
    return teacherWorkgroupIds;
  }

  getTeacherWorkgroupId(): number {
    const teacherUserInfo = this.getTeacherUserInfo();
    if (teacherUserInfo != null) {
      return teacherUserInfo.workgroupId;
    }
    return null;
  }

  getSharedTeacherWorkgroupIds(): number[] {
    const workgroupIds = [];
    this.getSharedTeacherUserInfos().forEach((sharedTeacherUserInfo: any) => {
      workgroupIds.push(sharedTeacherUserInfo.workgroupId);
    });
    return workgroupIds;
  }

  getTeacherUserInfo() {
    const myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      const myClassInfo = myUserInfo.myClassInfo;
      if (myClassInfo != null) {
        return myClassInfo.teacherUserInfo;
      }
    }
    return null;
  }

  /**
   * Get the shared teacher user infos for the run
   */
  getSharedTeacherUserInfos() {
    const myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      const myClassInfo = myUserInfo.myClassInfo;
      if (myClassInfo != null) {
        return myClassInfo.sharedTeacherUserInfos;
      }
    }
    return [];
  }

  getClassmateWorkgroupIds(includeSelf = false) {
    const workgroupIds = [];
    if (includeSelf) {
      workgroupIds.push(this.getWorkgroupId());
    }
    const classmateUserInfos = this.getClassmateUserInfos();
    if (classmateUserInfos != null) {
      for (let classmateUserInfo of classmateUserInfos) {
        if (classmateUserInfo != null) {
          const workgroupId = classmateUserInfo.workgroupId;

          if (workgroupId != null) {
            workgroupIds.push(workgroupId);
          }
        }
      }
    }
    return workgroupIds;
  }

  sortClassmateUserInfosAlphabeticallyByName() {
    const classmateUserInfos = this.getClassmateUserInfos();
    if (classmateUserInfos != null) {
      classmateUserInfos.sort(usernameComparator);
    }
    return classmateUserInfos;
  }

  getPermissions() {
    // a switched user (admin/researcher user impersonating a teacher) should not be able to view/grade
    return {
      canViewStudentNames: this.config.canViewStudentNames && !this.isSwitchedUser(),
      canGradeStudentWork: this.config.canGradeStudentWork && !this.isSwitchedUser(),
      canAuthorProject: this.config.canAuthorProject && !this.isSwitchedUser()
    };
  }

  private getAllUserInfoInPeriod(periodId: number): any {
    return this.getClassmateUserInfos()
      .map((userInfo) => {
        return userInfo.periodId === periodId ? userInfo : [];
      })
      .flat();
  }

  getAllUsersInPeriod(periodId: number): any[] {
    return this.getAllUserInfoInPeriod(periodId)
      .map((userInfo) => userInfo.users)
      .flat();
  }

  getUsersNotInWorkgroupInPeriod(periodId: number): any[] {
    const users = [];
    this.getAllUserInfoInPeriod(periodId).forEach((userInfo) => {
      if (userInfo.workgroupId == null) {
        users.push(...userInfo.users);
      }
    });
    return users;
  }

  getUserInfoByWorkgroupId(workgroupId) {
    let userInfo = null;
    if (workgroupId != null) {
      const myUserInfo = this.getMyUserInfo();
      if (myUserInfo != null) {
        const tempWorkgroupId = myUserInfo.workgroupId;
        if (workgroupId === tempWorkgroupId) {
          userInfo = myUserInfo;
        }
      }
      if (userInfo == null) {
        const classmateUserInfos = this.getClassmateUserInfos();
        if (classmateUserInfos != null) {
          for (let classmateUserInfo of classmateUserInfos) {
            if (classmateUserInfo != null) {
              const tempWorkgroupId = classmateUserInfo.workgroupId;
              if (workgroupId == tempWorkgroupId) {
                userInfo = classmateUserInfo;
                break;
              }
            }
          }
        }
      }
    }
    return userInfo;
  }

  getWorkgroupsByPeriod(periodId) {
    const workgroupsInPeriod = [];
    const myUserInfo = this.getMyUserInfo();
    if (this.isStudent() && isMatchingPeriods(myUserInfo.periodId, periodId)) {
      workgroupsInPeriod.push(myUserInfo);
    }
    for (const classmateUserInfo of this.getClassmateUserInfos()) {
      if (isMatchingPeriods(classmateUserInfo.periodId, periodId)) {
        workgroupsInPeriod.push(classmateUserInfo);
      }
    }
    return workgroupsInPeriod;
  }

  getNumberOfWorkgroupsInPeriod(periodId) {
    return this.getWorkgroupsByPeriod(periodId).length;
  }

  /**
   * Get the period id for a workgroup id
   * @param workgroupId the workgroup id
   * @returns the period id the workgroup id is in
   */
  getPeriodIdByWorkgroupId(workgroupId) {
    if (workgroupId != null) {
      const userInfo = this.getUserInfoByWorkgroupId(workgroupId);
      if (userInfo != null) {
        return userInfo.periodId;
      }
    }
    return null;
  }

  /**
   * Get the student names
   * @param workgroupId the workgroup id
   * @return an array containing the student names
   */
  getStudentFirstNamesByWorkgroupId(workgroupId) {
    const studentNames = [];
    const usernames = this.getUsernameByWorkgroupId(workgroupId);
    if (usernames != null) {
      const usernamesSplit = usernames.split(':');
      if (usernamesSplit != null) {
        for (let username of usernamesSplit) {
          const indexOfSpace = username.indexOf(' ');
          const studentFirstName = username.substring(0, indexOfSpace);
          studentNames.push(studentFirstName);
        }
      }
    }
    return studentNames;
  }

  getUserIdsByWorkgroupId(workgroupId) {
    if (workgroupId != null) {
      const userInfo = this.getUserInfoByWorkgroupId(workgroupId);
      if (userInfo != null) {
        return userInfo.userIds;
      }
    }
    return [];
  }

  getUsernameByWorkgroupId(workgroupId) {
    if (workgroupId != null) {
      const userInfo = this.getUserInfoByWorkgroupId(workgroupId);
      if (userInfo != null) {
        return userInfo.username;
      }
    }
    return null;
  }

  getDisplayNamesByWorkgroupId(workgroupId) {
    if (workgroupId != null) {
      const userInfo = this.getUserInfoByWorkgroupId(workgroupId);
      if (userInfo != null) {
        return userInfo.displayNames;
      }
    }
    return null;
  }

  getUsernamesByWorkgroupId(workgroupId) {
    let usernamesObjects = [];
    if (workgroupId != null) {
      let userInfo = this.getUserInfoByWorkgroupId(workgroupId);
      if (userInfo != null && userInfo.username != null) {
        let usernames = userInfo.username.split(':');
        for (let name of usernames) {
          let id = '';
          let regex = /(.+) \((.+)\)/g;
          let matches = regex.exec(name);
          if (matches) {
            name = matches[1];
            id = matches[2];
          }
          usernamesObjects.push({
            name: name,
            id: id
          });
        }
      }
    }
    return usernamesObjects;
  }

  getDisplayUsernamesByWorkgroupId(workgroupId: number): string {
    let usernames = '';
    if (workgroupId != null) {
      if (this.getPermissions().canViewStudentNames) {
        usernames = this.getUsernamesStringByWorkgroupId(workgroupId);
      } else {
        usernames = this.getUserIdsStringByWorkgroupId(workgroupId);
      }
    }
    return usernames;
  }

  getUsernamesStringByWorkgroupId(workgroupId: number): string {
    const names = this.getUsernamesByWorkgroupId(workgroupId);
    return names.length > 0
      ? names
          .map(function (obj) {
            return obj.name;
          })
          .join(', ')
      : '';
  }

  getUserIdsStringByWorkgroupId(workgroupId: number): string {
    return this.getUserIdsByWorkgroupId(workgroupId)
      .map((id) => $localize`Student ${id}`)
      .join(', ');
  }

  isPreview() {
    return this.getMode() === 'preview';
  }

  isAuthoring() {
    return this.getMode() === 'author';
  }

  isStudentRun() {
    return this.getMode() === 'studentRun';
  }

  isClassroomMonitor() {
    return this.getMode() === 'classroomMonitor';
  }

  /**
   * Convert a client timestamp to a server timestamp. This is required
   * in case the client and server clocks are not synchronized.
   * @param clientTimestamp the client timestamp
   */
  convertToServerTimestamp(clientTimestamp) {
    const timestampDiff = this.getConfigParam('timestampDiff');
    const serverTimestamp = clientTimestamp - timestampDiff;
    return serverTimestamp;
  }

  /**
   * Convert a server timestamp to a client timestamp. This is required
   * in case the client and server clocks are not synchronized.
   * @param serverTimestamp the client timestamp
   */
  convertToClientTimestamp(serverTimestamp) {
    return serverTimestamp + this.getConfigParam('timestampDiff');
  }

  isStudent(workgroupId = this.getWorkgroupId()) {
    return !this.isRunOwner(workgroupId) && !this.isRunSharedTeacher();
  }

  isSignedInUserATeacher(): boolean {
    return this.isRunOwner() || this.isRunSharedTeacher();
  }

  isTeacherWorkgroupId(workgroupId: number): boolean {
    return this.isTeacherIdentifyingId('workgroupId', workgroupId);
  }

  isTeacherUserId(userId: number): boolean {
    return this.isTeacherIdentifyingId('userId', userId);
  }

  isTeacherIdentifyingId(fieldName: string, value: number): boolean {
    const teacherUserInfo = this.getTeacherUserInfo();
    if (teacherUserInfo == null) {
      return false;
    }
    if (teacherUserInfo[fieldName] === value) {
      return true;
    }
    return this.getSharedTeacherUserInfos().some((userInfo: any) => {
      return userInfo[fieldName] === value;
    });
  }

  getTeacherUsername(userId: number): string {
    const teacherUserInfo = this.getTeacherUserInfo();
    if (teacherUserInfo.userId === userId) {
      return teacherUserInfo.username;
    }
    for (const sharedTeacherUserInfo of this.getSharedTeacherUserInfos()) {
      if (sharedTeacherUserInfo.userId === userId) {
        return sharedTeacherUserInfo.username;
      }
    }
    return null;
  }

  /**
   * Check if the workgroup is the owner of the run
   * @param workgroupId the workgroup id
   * @returns whether the workgroup is the owner of the run
   */
  isRunOwner(workgroupId = this.getWorkgroupId()) {
    if (workgroupId != null) {
      const teacherUserInfo = this.getTeacherUserInfo();
      if (teacherUserInfo != null) {
        if (workgroupId == teacherUserInfo.workgroupId) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if the workgroup is a shared teacher for the run
   * @param workgroupId the workgroup id
   * @returns whether the workgroup is a shared teacher of the run
   */
  isRunSharedTeacher(workgroupId = this.getWorkgroupId()) {
    if (workgroupId != null) {
      const sharedTeacherUserInfos = this.getSharedTeacherUserInfos();
      if (sharedTeacherUserInfos != null) {
        for (let sharedTeacherUserInfo of sharedTeacherUserInfos) {
          if (sharedTeacherUserInfo != null) {
            if (workgroupId == sharedTeacherUserInfo.workgroupId) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Get the teacher role for the run
   * @param workgroupId the workgroup id
   * @returns the role of the teacher for the run. the possible values are
   * 'owner', 'write', 'read'
   */
  getTeacherRole(workgroupId) {
    if (this.isRunOwner(workgroupId)) {
      return 'owner';
    } else if (this.isRunSharedTeacher(workgroupId)) {
      return this.getSharedTeacherRole(workgroupId);
    }
    return null;
  }

  /**
   * Get the shared teacher role for the run
   * @param workgroupId the workgroup id
   * @returns the shared teacher role for the run. the possible values are
   * 'write' or 'read'
   */
  getSharedTeacherRole(workgroupId) {
    if (workgroupId != null) {
      const sharedTeacherUserInfos = this.getSharedTeacherUserInfos();
      if (sharedTeacherUserInfos != null) {
        for (let sharedTeacherUserInfo of sharedTeacherUserInfos) {
          if (sharedTeacherUserInfo != null) {
            if (workgroupId == sharedTeacherUserInfo.workgroupId) {
              return sharedTeacherUserInfo.role;
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Replace student names in the content.
   * For example, we will replace instances of {{firstStudentFirstName}}
   * with the actual first name of the first student in the workgroup.
   * @param content a content object or string
   * @return an updated content object or string
   */
  replaceStudentNames(content) {
    if (content != null) {
      let contentString = content;
      if (typeof content === 'object') {
        contentString = JSON.stringify(content);
      }
      if (contentString != null) {
        const workgroupId = this.getWorkgroupId();
        const firstNames = this.getStudentFirstNamesByWorkgroupId(workgroupId);

        if (firstNames.length >= 1) {
          /*
           * there are 1 or more students in the workgroup so we can
           * replace the first student first name with the actual
           * name
           */
          contentString = contentString.replace(
            new RegExp('{{firstStudentFirstName}}', 'gi'),
            firstNames[0]
          );

          /*
           * there are 1 or more students in the workgroup so we can
           * replace the student first names with the actual names
           */
          contentString = contentString.replace(
            new RegExp('{{studentFirstNames}}', 'gi'),
            firstNames.join(', ')
          );
        }

        if (firstNames.length >= 2) {
          /*
           * there are 2 or more students in the workgroup so we can
           * replace the second student first name with the actual
           * name
           */
          contentString = contentString.replace(
            new RegExp('{{secondStudentFirstName}}', 'gi'),
            firstNames[1]
          );
        }

        if (firstNames.length >= 3) {
          /*
           * there are 3 or more students in the workgroup so we can
           * replace the third student first name with the actual
           * name
           */
          contentString = contentString.replace(
            new RegExp('{{thirdStudentFirstName}}', 'gi'),
            firstNames[2]
          );
        }
      }

      if (typeof content === 'object') {
        // convert the content string back into an object
        content = JSON.parse(contentString);
      } else if (typeof content === 'string') {
        // the content was a string so we can just use the content string
        content = contentString;
      }
    }
    return content;
  }

  /**
   * Get the project assets folder path
   * @param includeHost whether to include the host in the URL
   * @return the project assets folder path
   * e.g.
   * with host
   * http://wise.berkeley.edu/wise/curriculum/3/assets
   * without host
   * /wise/curriculum/3/assets
   */
  getProjectAssetsDirectoryPath(includeHost = false) {
    const projectBaseURL = this.getConfigParam('projectBaseURL');
    if (projectBaseURL != null) {
      if (includeHost) {
        const host = window.location.origin;

        /*
         * get the full path including the host
         * e.g. http://wise.berkeley.edu/wise/curriculum/3/assets
         */
        return host + projectBaseURL + 'assets';
      } else {
        /*
         * get the full path not including the host
         * e.g. /wise/curriculum/3/assets
         */
        return projectBaseURL + 'assets';
      }
    }
    return null;
  }

  /**
   * Remove the absolute asset paths
   * e.g.
   * <img src='https://wise.berkeley.edu/curriculum/3/assets/sun.png'/>
   * will be changed to
   * <img src='sun.png'/>
   * @param html the html
   * @return the modified html without the absolute asset paths
   */
  removeAbsoluteAssetPaths(html) {
    /*
     * get the assets directory path with the host
     * e.g.
     * https://wise.berkeley.edu/wise/curriculum/3/assets/
     */
    const includeHost = true;
    const assetsDirectoryPathIncludingHost = this.getProjectAssetsDirectoryPath(includeHost);
    const assetsDirectoryPathIncludingHostRegEx = new RegExp(assetsDirectoryPathIncludingHost, 'g');

    /*
     * get the assets directory path without the host
     * e.g.
     * /wise/curriculum/3/assets/
     */
    const assetsDirectoryPathNotIncludingHost = this.getProjectAssetsDirectoryPath() + '/';
    const assetsDirectoryPathNotIncludingHostRegEx = new RegExp(
      assetsDirectoryPathNotIncludingHost,
      'g'
    );

    /*
     * remove the directory path from the html so that only the file name
     * remains in asset references
     * e.g.
     * <img src='https://wise.berkeley.edu/wise/curriculum/3/assets/sun.png'/>
     * will be changed to
     * <img src='sun.png'/>
     */
    html = html.replace(assetsDirectoryPathIncludingHostRegEx, '');
    html = html.replace(assetsDirectoryPathNotIncludingHostRegEx, '');
    return html;
  }

  /**
   * Get all the authorable projects
   */
  getAuthorableProjects() {
    const ownedProjects = this.getConfigParam('projects');
    const sharedProjects = this.getConfigParam('sharedProjects');
    let authorableProjects = [];
    if (ownedProjects != null) {
      authorableProjects = authorableProjects.concat(ownedProjects);
    }

    if (sharedProjects != null) {
      authorableProjects = authorableProjects.concat(sharedProjects);
    }

    // sort the projects by descending id
    authorableProjects.sort(this.sortByProjectId);
    return authorableProjects;
  }

  /**
   * Determines whether the current user is logged in as somebody else
   * @return true iff the user is a switched user
   */
  isSwitchedUser() {
    let myUserInfo = this.getMyUserInfo();
    if (myUserInfo != null) {
      if (myUserInfo.isSwitchedUser) {
        return true;
      }
    }
    return false;
  }

  /**
   * Sort the objects by descending id.
   * @param projectA an object with an id field
   * @param projectB an object with an id field
   * @return 1 if projectA comes before projectB
   * -1 if projectA comes after projectB
   * 0 if they are the same
   */
  sortByProjectId(projectA, projectB) {
    const projectIdA = projectA.id;
    const projectIdB = projectB.id;
    if (projectIdA < projectIdB) {
      return 1;
    } else if (projectIdA > projectIdB) {
      return -1;
    } else {
      return 0;
    }
  }

  calculateIsRunActive(configJSON) {
    const currentTime = new Date().getTime();
    if (currentTime < this.convertToClientTimestamp(configJSON.startTime)) {
      return false;
    } else if (this.isEndedAndLocked(configJSON)) {
      return false;
    }
    return true;
  }

  isEndedAndLocked(configJSON = this.config) {
    return (
      configJSON.endTime != null &&
      new Date().getTime() > this.convertToClientTimestamp(configJSON.endTime) &&
      configJSON.isLockedAfterEndDate
    );
  }

  getPrettyEndDate(): string {
    return formatDate(this.getEndDate(), 'mediumDate', this.localeID);
  }

  getStartDate() {
    return this.config.startTime;
  }

  getEndDate() {
    return this.config.endTime;
  }

  isRunActive() {
    return this.config.isRunActive;
  }

  getFormattedStartDate() {
    return millisecondsToDateTime(this.getStartDate());
  }

  getFormattedEndDate() {
    if (this.getEndDate() != null) {
      return millisecondsToDateTime(this.getEndDate());
    }
    return '';
  }

  isGoogleUser() {
    return this.getMyUserInfo().isGoogleUser;
  }
}
