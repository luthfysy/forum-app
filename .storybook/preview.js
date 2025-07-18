// .storybook/preview.js
import React from 'react'; // Pastikan React diimpor
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

/** @type { import('@storybook/react-webpack5').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  // TAMBAHKAN GLOBAL DECORATOR UNTUK MEMBUNGKUS SEMUA STORIES DENGAN MemoryRouter
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;