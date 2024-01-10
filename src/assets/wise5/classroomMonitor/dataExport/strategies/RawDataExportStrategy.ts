import * as angular from 'angular';
import { AbstractDataExportStrategy } from './AbstractDataExportStrategy';
import * as FileSaver from 'file-saver';

export class RawDataExportStrategy extends AbstractDataExportStrategy {
  export() {
    this.controller.showDownloadingExportMessage();
    var selectedNodes = [];

    /*
     * holds the mappings from nodeid or nodeid-componentid to a boolean
     * value of whether the node was selected
     * example
     * selectedNodesMap["node3"] = true
     * selectedNodesMap["node4-wt38sdf1d3"] = true
     */
    var selectedNodesMap = null;
    if (this.controller.exportStepSelectionType === 'exportSelectSteps') {
      selectedNodes = this.controller.getSelectedNodesToExport();
      if (selectedNodes == null || selectedNodes.length == 0) {
        alert('Please select a step to export.');
        this.controller.hideDownloadingExportMessage();
        return;
      } else {
        selectedNodesMap = this.getSelectedNodesMap(selectedNodes);
      }
    }
    this.dataExportService.retrieveRawDataExport(selectedNodes).then((result) => {
      var runId = this.configService.getRunId();
      var data: any = {};
      var workgroups = this.configService.getClassmateUserInfosSortedByWorkgroupId();
      workgroups = this.utilService.makeCopyOfJSONObject(workgroups);
      for (var w = 0; w < workgroups.length; w++) {
        var workgroup = workgroups[w];
        if (workgroup != null) {
          if (!this.controller.includeStudentNames) {
            this.removeNamesFromWorkgroup(workgroup);
          }
          var workgroupId = workgroup.workgroupId;
          if (this.controller.includeStudentWork) {
            workgroup.studentWork = [];
            var componentStates = this.teacherDataService.getComponentStatesByWorkgroupId(
              workgroupId
            );
            if (componentStates != null) {
              for (var c = 0; c < componentStates.length; c++) {
                var componentState = componentStates[c];
                if (componentState != null) {
                  var compositeId = this.getCompositeId(componentState);
                  if (
                    selectedNodesMap == null ||
                    (compositeId != null && selectedNodesMap[compositeId] == true)
                  ) {
                    workgroup.studentWork.push(componentState);
                  }
                }
              }
            }
          }
          if (this.controller.includeAnnotations) {
            workgroup.annotations = [];
            var annotations = this.teacherDataService.getAnnotationsToWorkgroupId(workgroupId);
            if (annotations != null) {
              for (var a = 0; a < annotations.length; a++) {
                var annotation = annotations[a];
                if (annotation != null) {
                  var compositeId = this.getCompositeId(annotation);
                  if (
                    selectedNodesMap == null ||
                    (compositeId != null && selectedNodesMap[compositeId] == true)
                  ) {
                    workgroup.annotations.push(annotation);
                  }
                }
              }
            }
          }
          if (this.controller.includeEvents) {
            workgroup.events = [];
            var events = this.teacherDataService.getEventsByWorkgroupId(workgroupId);
            if (events != null) {
              for (var e = 0; e < events.length; e++) {
                var event = events[e];
                if (event != null) {
                  var compositeId = this.getCompositeId(event);
                  if (
                    selectedNodesMap == null ||
                    (compositeId != null && selectedNodesMap[compositeId] == true)
                  ) {
                    workgroup.events.push(event);
                  }
                }
              }
            }
          }
        }
      }
      data.workgroups = workgroups;
      const dataJSONString = angular.toJson(data, 4);
      const blob = new Blob([dataJSONString]);
      FileSaver.saveAs(blob, runId + '_raw_data.json');
      this.controller.hideDownloadingExportMessage();
    });
  }

  private removeNamesFromWorkgroup(workgroup): void {
    delete workgroup.username;
    delete workgroup.displayNames;
    for (let user of workgroup.users) {
      delete user.name;
      delete user.firstName;
      delete user.lastName;
    }
  }

  /**
   * Get the composite id for a given object
   * @param object a component state, annotation, or event
   * @return the composite id for the object
   * example
   * 'node3'
   * 'node4-wt38sdf1d3'
   */
  private getCompositeId(object): string {
    var compositeId = null;
    if (object.nodeId != null) {
      compositeId = object.nodeId;
    }
    if (object.componentId != null) {
      compositeId += '-' + object.componentId;
    }
    return compositeId;
  }
}
