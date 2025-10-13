import { moduleMetadata, type Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        method: 'alphabetical'
      }
    }
  },
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MAT_TABS_CONFIG,
          useValue: {
            animationDuration: '400ms',
            stretchTabs: false
          }
        }
      ]
    })
  ]
};

export default preview;
