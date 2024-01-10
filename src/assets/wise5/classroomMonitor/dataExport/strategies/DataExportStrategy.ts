import { DataExportContext } from '../DataExportContext';

export interface DataExportStrategy {
  setDataExportContext(context: DataExportContext);
  export();
}
