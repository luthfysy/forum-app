// .storybook/main.js
/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    // HAPUS BARIS INI SECARA MUTLAK: "@storybook/preset-create-react-app",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    // PASTIKAN ADDONS INI JUGA ADA, KARENA MUNGKIN DISEDIAKAN OLEH PRESET SEBELUMNYA
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  "staticDirs": [
    "..\\public"
  ],
  // TAMBAHKAN BLOK webpackFinal INI SECARA MUTLAK
  webpackFinal: async (config) => {
    // Konfigurasi Babel untuk JSX dan ESNext
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    });

    // Konfigurasi untuk asset seperti gambar, font
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      type: 'asset/resource',
    });

    // Konfigurasi untuk CSS (jika Anda punya file CSS di luar node_modules)
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      exclude: /\.module\.css$/, // Kecualikan CSS Modules jika Anda menggunakannya
    });

    // Konfigurasi untuk CSS Modules (jika Anda menggunakannya)
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
      ],
    });

    // Pastikan resolusi ekstensi .jsx
    config.resolve.extensions.push('.jsx');

    return config;
  },
};
export default config;