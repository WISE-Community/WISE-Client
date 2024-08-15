import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { BranchService } from '../../assets/wise5/services/branchService';
import { Branch } from '../domain/branch';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: BranchService;
let configService: ConfigService;

let paths: string[][];
const branchesCache = [new Branch('node100', [['node200a'], ['node200b']], 'node400')];
const expectedBranches = [new Branch('node1', [['node2a'], ['node2b']], 'node3')];
const expectedBranchesWithNoBranch = [];
const expectedBranchesWithNoMergePoint = [
  new Branch(
    'node1',
    [
      ['node2a', 'node3a', 'node4a'],
      ['node2b', 'node3b', 'node4b']
    ],
    null
  )
];
const pathsWithNoBranch = [['node1', 'node2', 'node3', 'node4']];
const pathsWithNoMergePoint = [
  ['node1', 'node2a', 'node3a', 'node4a'],
  ['node1', 'node2b', 'node3b', 'node4b']
];

describe('BranchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(BranchService);
    paths = [
      ['node1', 'node2a', 'node3', 'node4'],
      ['node1', 'node2b', 'node3', 'node4']
    ];
  });
  getBranches();
});

function getBranches() {
  describe('getBranches()', () => {
    getBranches_AnyMode();
    getBranches_AuthorMode();
    getBranches_NonAuthorMode();
  });
}

function getBranches_AnyMode() {
  describe('in any mode', () => {
    getBranches_AnyMode_CalculateAndReturnBranchesWhenThereAreNoBranches();
    getBranches_AnyMode_CalculateAndReturnBranchesWhenThereIsNoMergeStep();
  });
}

function getBranches_AnyMode_CalculateAndReturnBranchesWhenThereAreNoBranches() {
  it('should calculate and return branches when there are no branches', () => {
    expect(service.getBranches(pathsWithNoBranch)).toEqual(expectedBranchesWithNoBranch);
  });
}

function getBranches_AnyMode_CalculateAndReturnBranchesWhenThereIsNoMergeStep() {
  it('should calculate and return branches when there is no merge step', () => {
    expect(service.getBranches(pathsWithNoMergePoint)).toEqual(expectedBranchesWithNoMergePoint);
  });
}

function getBranches_AuthorMode() {
  describe('in author mode', () => {
    beforeEach(() => spyOn(configService, 'getMode').and.returnValue('author'));
    getBranches_AuthorMode_CalculateAndReturnBranches();
  });
}

function getBranches_AuthorMode_CalculateAndReturnBranches() {
  it('should calculate and return branches but not set cache', () => {
    expect(service.getBranches(paths)).toEqual(expectedBranches);
    expect(service.branchesCache).toBeUndefined();
  });
}

function getBranches_NonAuthorMode() {
  describe('in non-author mode', () => {
    beforeEach(() => spyOn(configService, 'getMode').and.returnValue('student'));
    getBranches_NonAuthorModeCachedBranches_ReturnCachedBranches();
    getBranches_NonAuthorModeNoCachedBranches_CalculateAndReturnBranches();
  });
}

function getBranches_NonAuthorModeCachedBranches_ReturnCachedBranches() {
  it('should return cachedBranches if it exists', () => {
    service.branchesCache = branchesCache;
    expect(service.getBranches(paths)).toEqual(branchesCache);
  });
}

function getBranches_NonAuthorModeNoCachedBranches_CalculateAndReturnBranches() {
  it('should calculate, set cache and return branches if cachedBranches does not exist', () => {
    expect(service.getBranches(paths)).toEqual(expectedBranches);
    expect(service.branchesCache).toEqual(expectedBranches);
  });
}
