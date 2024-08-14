export const newProjectTemplate = {
  nodes: [
    {
      id: 'group0',
      type: 'group',
      title: 'Master',
      startId: 'group1',
      ids: ['group1']
    },
    {
      id: 'group1',
      type: 'group',
      title: $localize`First Lesson`,
      startId: 'node1',
      ids: ['node1'],
      icons: {
        default: {
          color: '#2196F3',
          type: 'font',
          fontSet: 'material-icons',
          fontName: 'info'
        }
      },
      transitionLogic: {
        transitions: []
      }
    },
    {
      id: 'node1',
      type: 'node',
      title: $localize`First Step`,
      components: [],
      constraints: [],
      showSaveButton: false,
      showSubmitButton: false,
      transitionLogic: {
        transitions: []
      }
    }
  ],
  constraints: [],
  startGroupId: 'group0',
  startNodeId: 'node1',
  navigationMode: 'guided',
  layout: {
    template: 'starmap|leftNav|rightNav'
  },
  metadata: {
    title: ''
  },
  notebook: {
    enabled: false,
    label: $localize`Notebook`,
    enableAddNew: true,
    itemTypes: {
      note: {
        type: 'note',
        enabled: true,
        enableLink: true,
        enableAddNote: true,
        enableClipping: true,
        enableStudentUploads: true,
        requireTextOnEveryNote: false,
        label: {
          singular: $localize`note`,
          plural: $localize`notes`,
          link: $localize`Notes`,
          icon: 'note',
          color: '#1565C0'
        }
      },
      report: {
        enabled: false,
        label: {
          singular: $localize`report`,
          plural: $localize`reports`,
          link: $localize`Report`,
          icon: 'assignment',
          color: '#AD1457'
        },
        notes: [
          {
            reportId: 'finalReport',
            title: $localize`Final Report`,
            description: $localize`Final summary report of what you learned in this unit`,
            prompt: $localize`Use this space to write your final report using evidence from your notebook.`,
            content: $localize`<h3>This is a heading</h3><p>This is a paragraph.</p>`
          }
        ]
      }
    }
  },
  teacherNotebook: {
    enabled: true,
    label: $localize`Teacher Notebook`,
    enableAddNew: true,
    itemTypes: {
      note: {
        type: 'note',
        enabled: false,
        enableLink: true,
        enableAddNote: true,
        enableClipping: true,
        enableStudentUploads: true,
        requireTextOnEveryNote: false,
        label: {
          singular: $localize`note`,
          plural: $localize`notes`,
          link: $localize`Notes`,
          icon: 'note',
          color: '#1565C0'
        }
      },
      report: {
        enabled: true,
        label: {
          singular: $localize`teacher notes`,
          plural: $localize`teacher notes`,
          link: $localize`Teacher Notes`,
          icon: 'assignment',
          color: '#AD1457'
        },
        notes: [
          {
            reportId: 'teacherReport',
            title: $localize`Teacher Notes`,
            description: $localize`Notes for the teacher as they're running the WISE unit`,
            prompt: $localize`Use this space to take notes for this unit`,
            content: $localize`<p>Use this space to take notes for this unit</p>`
          }
        ]
      }
    }
  },
  inactiveNodes: []
};
