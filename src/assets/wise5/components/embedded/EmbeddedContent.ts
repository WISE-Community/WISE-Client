import { ComponentContent } from '../../common/ComponentContent';

export interface EmbeddedContent extends ComponentContent {
  parameters?: any;
  url: string;
}
