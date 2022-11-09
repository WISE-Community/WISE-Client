import { TestBed } from '@angular/core/testing';
import { TabulatorData } from '../../assets/wise5/components/table/TabulatorData';
import { TabulatorDataService } from '../../assets/wise5/components/table/tabulatorDataService';
import sampleTableData from './sampleData/sample_table_data.json';

let tabulatorDataService: TabulatorDataService;
const tableData = sampleTableData;
const globalCellSize = 10;

describe('TabulatorDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TabulatorDataService]
    });
    tabulatorDataService = TestBed.inject(TabulatorDataService);
  });
  convertTableDataToTabulator();
});

function convertTableDataToTabulator() {
  describe('convertTableDataToTabulator()', () => {
    it('should convert table data to TabulatorData', () => {
      const tabulatorData: TabulatorData = tabulatorDataService.convertTableDataToTabulator(
        tableData,
        globalCellSize
      );
      expect(tabulatorData.columns.length).toBe(3);
      expect(tabulatorData.columns[0].title).toBe('Age');
      expect(tabulatorData.columns[0].field).toBe('0');
      expect(tabulatorData.columns[2].width).toBe(320);
      expect(tabulatorData.data.length).toBe(3);
      expect(tabulatorData.data[1]['0']).toBe('10');
      expect(tabulatorData.options.maxHeight).toBe('500px');
      expect(tabulatorData.editableCells[1]).toEqual(['1', '2']);
    });
  });
}
