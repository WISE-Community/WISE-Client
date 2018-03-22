"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotebookNotesController = function () {
    function NotebookNotesController($filter, $rootScope, $scope, NotebookService) {
        var _this = this;

        _classCallCheck(this, NotebookNotesController);

        this.$translate = $filter('translate');
        this.$rootScope = $rootScope;
        this.NotebookService = NotebookService;
        this.groups = [];
        this.selectedTabIndex = 0;
        this.$scope = $scope;

        this.$scope.$watch(function () {
            return _this.selectedTabIndex;
        }, function (current, old) {
            console.log('old:' + old);
            console.log('current:' + current);
        });
        this.publicNotebookItems = this.NotebookService.publicNotebookItems;

        var personalGroup = {
            title: "Personal",
            name: "private",
            isEditAllowed: true,
            items: []
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(this.notebook.items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _slicedToArray(_step.value, 2),
                    personalItemKey = _step$value[0],
                    personalItemValue = _step$value[1];

                if (personalItemValue.last().type === 'note') {
                    personalGroup.items.push(personalItemValue.last());
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        ;

        this.groups.push(personalGroup);

        this.$onInit = function () {
            _this.color = _this.config.itemTypes.note.label.color;
        };

        this.$onChanges = function (changes) {
            if (changes.notebook) {
                _this.notebook = angular.copy(changes.notebook.currentValue);
                _this.hasNotes = Object.keys(_this.notebook.items).length ? true : false;
            }
        };

        this.$rootScope.$on('publicNotebookItemsRetrieved', function (event, args) {
            var publicGroupFound = false;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _this.groups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var group = _step2.value;

                    if (group.name == "public") {
                        group.items = _this.publicNotebookItems["public"];
                        publicGroupFound = true;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (!publicGroupFound) {
                var publicGroup = {
                    title: "Public",
                    name: "public",
                    isEditAllowed: false,
                    items: _this.publicNotebookItems["public"]
                };
                _this.groups.push(publicGroup);
            }
            _this.selectedTabIndex = 0;
        });
    }

    _createClass(NotebookNotesController, [{
        key: 'getTitle',
        value: function getTitle() {
            var title = '';
            if (this.insertMode) {
                title = this.$translate('selectItemToInsert');
            } else {
                title = this.config.itemTypes.note.label.link;
            }
            return title;
        }
    }, {
        key: 'deleteItem',
        value: function deleteItem($ev, $itemId) {
            var doDelete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            this.$rootScope.$broadcast('deleteNote', { itemId: $itemId, ev: $ev });
        }
    }, {
        key: 'reviveItem',
        value: function reviveItem(ev, itemId) {
            this.$rootScope.$broadcast('reviveNote', { itemId: $itemId, ev: $ev });
        }
    }, {
        key: 'editItem',
        value: function editItem($ev, $itemId) {
            //this.NotebookService.editItem(ev, itemId);
            this.$rootScope.$broadcast('editNote', { itemId: $itemId, ev: $ev });
        }
    }, {
        key: 'select',
        value: function select($ev, $itemId) {
            if (this.insertMode) {
                this.onInsert({ value: $itemId, event: $ev });
            } else {
                this.editItem($ev, $itemId);
            }
        }
    }, {
        key: 'edit',
        value: function edit(itemId) {
            alert("Edit the item: " + itemId);
        }
    }, {
        key: 'close',
        value: function close($event) {
            this.onClose($event);
        }
    }, {
        key: 'cancelInsertMode',
        value: function cancelInsertMode($event) {
            this.onSetInsertMode({ value: false });
        }
    }]);

    return NotebookNotesController;
}();

NotebookNotesController.$inject = ['$filter', '$rootScope', '$scope', 'NotebookService'];

var NotebookNotes = {
    bindings: {
        config: '<',
        insertMode: '<',
        notebook: '<',
        publicNotebookItems: '<',
        notesVisible: '<',
        workgroupId: '<',
        onClose: '&',
        onInsert: '&',
        onSetInsertMode: '&'
    },
    template: '<md-sidenav md-component-id="notes"\n                     md-is-open="$ctrl.notesVisible"\n                     md-whiteframe="4"\n                     md-disable-backdrop\n                     layout="column"\n                     class="md-sidenav-right notebook-sidebar">\n            <md-toolbar>\n                <div class="md-toolbar-tools"\n                     ng-class="{\'insert-mode\': $ctrl.insertMode}"\n                     style="background-color: {{$ctrl.color}};">\n                    {{$ctrl.getTitle()}}\n                    <!--<md-button ng-if="$ctrl.insertMode"\n                               ng-click="$ctrl.cancelInsertMode($event)"\n                               md-theme="default"\n                               class="md-accent button--small"\n                               aria-label="{{ \'Cancel\' | translate }}">\n                        {{ \'Cancel\' | translate }}\n                    </md-button>-->\n                    <span flex></span>\n                    <md-button ng-click="$ctrl.close($event)"\n                               class="md-icon-button"\n                               aria-label="{{ \'Close\' | translate }}">\n                        <md-icon>close</md-icon>\n                    </md-button>\n                </div>\n            </md-toolbar>\n            <md-content>\n            <md-tabs md-selected="$ctrl.selectedTabIndex" md-dynamic-height md-border-bottom md-autoselect md-swipe-content>\n              <md-tab ng-repeat="group in $ctrl.groups"\n                      ng-disabled="group.disabled"\n                      label="{{group.title}}">\n                <div class="demo-tab tab{{$index%4}}" style="padding: 25px; text-align: center;">\n                    <div class="notebook-items" ng-class="{\'notebook-items--insert\': $ctrl.insertMode}" layout="row" layout-wrap>\n                    <div class="md-padding" ng-if="!$ctrl.hasNotes" translate="noNotes" translate-value-term="{{$ctrl.config.itemTypes.note.label.plural}}"></div>\n                    <notebook-item ng-repeat="note in group.items"\n                                 config="$ctrl.config"\n                                 group="{{group.name}}"\n                                 item-id="note.localNotebookItemId"\n                                 is-edit-allowed="group.isEditAllowed"\n                                 is-choose-mode="$ctrl.insertMode"\n                                 workgroup-id="note.workgroupId"\n                                 on-select="$ctrl.select($ev, $itemId)"\n                                 on-delete="$ctrl.deleteItem($ev, $itemId)"\n                                 style="display: flex;"\n                                 flex="100"\n                                 flex-gt-xs="50">\n                    </notebook-item>\n                    <!--\n                    <notebook-item ng-repeat="(localNotebookItemId, notes) in $ctrl.notebook.items"\n                                 ng-if="notes.last().type === \'note\'"\n                                 config="$ctrl.config"\n                                 item-id="localNotebookItemId"\n                                 is-edit-allowed="!$ctrl.insertMode"\n                                 is-choose-mode="$ctrl.insertMode"\n                                 workgroup-id="$ctrl.workgroupId"\n                                 on-select="$ctrl.select($ev, $itemId)"\n                                 on-delete="$ctrl.deleteItem($ev, $itemId)"\n                                 style="display: flex;"\n                                 flex="100"\n                                 flex-gt-xs="50">\n                    </notebook-item>\n                    <notebook-item ng-repeat="note in $ctrl.publicNotebookItems.public"\n                                 config="$ctrl.config"\n                                 group="public"\n                                 item-id="note.localNotebookItemId"\n                                 is-edit-allowed="false"\n                                 is-choose-mode="$ctrl.insertMode"\n                                 workgroup-id="note.workgroupId"\n                                 on-select="$ctrl.select($ev, $itemId)"\n                                 on-delete="$ctrl.deleteItem($ev, $itemId)"\n                                 style="display: flex;"\n                                 flex="100"\n                                 flex-gt-xs="50">\n                    </notebook-item>\n                    -->\n\n                    <!-- TODO: show deleted items somewhere\n                        <notebook-item ng-repeat="(localNotebookItemId, notes) in $ctrl.notebook.deletedItems"\n                                       ng-if="notes.last().type === \'note\'"\n                                       config="$ctrl.config"\n                                       item-id="localNotebookItemId"\n                                       is-edit-allowed="!$ctrl.insertMode"\n                                       is-choose-mode="$ctrl.insertMode"\n                                       workgroup-id="$ctrl.workgroupId"\n                                       on-select="$ctrl.select($ev, $itemId)"\n                                       on-revive="$ctrl.deleteItem($ev, $itemId)"\n                                       style="display: flex;"\n                                       flex="100"\n                                       flex-gt-xs="50">\n                        </notebook-item>\n                    -->\n                </div> <!-- TODO: add questions when supported -->\n                </div>\n              </md-tab>\n            </md-tabs>\n\n            </md-content>\n        </md-sidenav>',
    controller: NotebookNotesController
};

exports.default = NotebookNotes;
//# sourceMappingURL=notebookNotes.js.map
