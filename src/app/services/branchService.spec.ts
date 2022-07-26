import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { BranchService } from '../../assets/wise5/services/branchService';
import { Branch } from '../domain/branch';

let service: BranchService;
let configService: ConfigService;

let paths: string[][];
const expectedBranches = [new Branch('node1', [['node2a'], ['node2b']], 'node3')];
const branchesCache = [new Branch('node100', [['node200a'], ['node200b']], 'node400')];

describe('BranchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule]
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
    getBranches_AuthorMode();
    getBranches_NonAuthorMode();
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
