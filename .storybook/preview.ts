import { moduleMetadata, type Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import docsTheme from './docsTheme';

setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      theme: docsTheme,
      toc: { headingSelector: 'h2, h3' }
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Design Tokens & Guidelines', ['Color', 'Typography', 'Layout'], 'Components']
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
