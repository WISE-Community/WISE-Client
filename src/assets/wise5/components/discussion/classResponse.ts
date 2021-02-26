'use strict';

const ClassResponse = {
  bindings: {
    response: '<',
    mode: '@',
    deletebuttonclicked: '&',
    undodeletebuttonclicked: '&',
    submitbuttonclicked: '&',
    studentdatachanged: '&',
    isdisabled: '<'
  },
  templateUrl: 'assets/wise5/components/discussion/classResponse.html',
  controller: 'ClassResponseController as classResponseCtrl'
};

export default ClassResponse;
